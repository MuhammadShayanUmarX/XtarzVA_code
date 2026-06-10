import base64
import logging
import re
from typing import Dict, Any, List, Optional

from ..config import settings
from ..models.schemas import (
    CommerceCreationOutput,
    MetaAdsSpyOutput,
    ProductIntelligenceOutput,
    CompetitorIntelligenceOutput,
    ProductSourcingOutput,
    ProductVariant,
)
from ..core.llm import call_with_fallback
from ..core.prompt_loader import (
    build_system_prompt,
    build_user_prompt,
    get_field_labels,
    get_image_prompt_templates,
    get_llm_config,
    get_max_prompt_chars,
    get_tone_aesthetics,
    render,
    render_user_block,
)
from ..core.tools import research_tools

logger = logging.getLogger(__name__)

AGENT_ID = "commerce_creation"


class CommerceCreationEngine:
    def _slugify(self, text: str) -> str:
        slug = re.sub(r"[^\w\s-]", "", text.lower())
        return re.sub(r"[-\s]+", "-", slug).strip("-") or "store"

    def _build_brand_context(self, initial_input: Optional[Dict[str, Any]]) -> str:
        if not initial_input:
            return ""
        parts = []
        field_labels = get_field_labels(AGENT_ID)
        for key, label in field_labels.items():
            val = initial_input.get(key, "")
            if isinstance(val, str) and val.strip():
                parts.append(f"{label}: {val.strip()}")
        return "\n".join(parts)

    def _competitor_context(self, competitor: CompetitorIntelligenceOutput) -> str:
        parts = [
            f"Market saturation: {competitor.market_saturation_score}/100",
        ]
        if competitor.competitor_weaknesses:
            parts.append(f"Competitor weaknesses to exploit: {', '.join(competitor.competitor_weaknesses[:4])}")
        if competitor.pricing_gaps:
            parts.append(f"Pricing gaps: {', '.join(competitor.pricing_gaps[:3])}")
        if competitor.product_opportunities:
            parts.append(f"Positioning opportunities: {', '.join(competitor.product_opportunities[:3])}")
        return "\n".join(parts)

    def _marketing_context(self, meta: Optional[MetaAdsSpyOutput]) -> str:
        if not meta:
            return render_user_block(AGENT_ID, "no_marketing")
        parts = [
            f"Product title: {meta.product_title}",
            f"SEO meta title: {meta.seo_meta_title}",
            f"SEO meta description: {meta.seo_meta_description}",
        ]
        if meta.seo_titles:
            parts.append(f"SEO title options: {' | '.join(meta.seo_titles[:3])}")
        if meta.product_creative_description:
            parts.append(f"Product story:\n{meta.product_creative_description[:800]}")
        if meta.bullet_benefits:
            parts.append(f"Key benefits: {'; '.join(meta.bullet_benefits[:5])}")
        if meta.tags:
            parts.append(f"Shopify tags: {', '.join(meta.tags[:8])}")
        if meta.ad_copy_hooks:
            parts.append(f"Proven hooks (tone reference): {' | '.join(meta.ad_copy_hooks[:2])}")
        if meta.faqs:
            faq_text = "; ".join(
                f"Q:{f.get('question','')} A:{f.get('answer','')[:80]}"
                for f in meta.faqs[:2]
                if isinstance(f, dict)
            )
            if faq_text:
                parts.append(f"Customer FAQs: {faq_text}")
        return "\n".join(parts)

    def _suggested_retail_price(self, sourcing_data: ProductSourcingOutput) -> str:
        unit = sourcing_data.best_option.price_per_unit
        margin = sourcing_data.profit_margin_estimate or 35.0
        multiplier = 2.8 if margin < 40 else 2.5
        return str(round(unit * multiplier, 2))

    def _enrich_output(
        self,
        output: CommerceCreationOutput,
        product_name: str,
        sourcing_data: ProductSourcingOutput,
        meta: Optional[MetaAdsSpyOutput],
    ) -> CommerceCreationOutput:
        retail = self._suggested_retail_price(sourcing_data)
        compare = str(round(float(retail) * 1.25, 2))

        if not output.theme_name:
            output.theme_name = meta.product_title if meta and meta.product_title else product_name
        if not output.theme_slug:
            output.theme_slug = self._slugify(output.theme_name)
        if not output.hero_headline:
            output.hero_headline = (
                meta.seo_titles[0] if meta and meta.seo_titles else output.theme_name
            )
        if not output.hero_subheadline and meta:
            output.hero_subheadline = (
                meta.seo_meta_description or meta.product_creative_description[:180]
            )
        if not output.hero_button_label:
            output.hero_button_label = "Shop the collection"
        if not output.about_snippet and meta:
            output.about_snippet = meta.product_creative_description
        if not output.collection_title:
            output.collection_title = f"The {product_name} Collection"
        if not output.product_handle:
            output.product_handle = self._slugify(
                meta.product_title if meta and meta.product_title else product_name
            )
        if not output.collection_handle:
            output.collection_handle = self._slugify(output.collection_title)
        if not output.variants:
            output.variants = [
                ProductVariant(title="Default", price=retail, compare_at_price=compare)
            ]
        if not output.theme_colors or len(output.theme_colors) < 4:
            defaults = {
                "primary": "#0f0f0f",
                "accent": "#c9a962",
                "background": "#faf9f7",
                "surface": "#ffffff",
                "text_muted": "#6b6b6b",
                "accent_soft": "#e8dfd0",
            }
            merged = {**defaults, **(output.theme_colors or {})}
            output = output.model_copy(update={"theme_colors": merged})
        if not output.trust_points and meta and meta.bullet_benefits:
            output = output.model_copy(update={"trust_points": meta.bullet_benefits[:3]})
        return output

    def _build_image_prompts(
        self,
        output: CommerceCreationOutput,
        product_name: str,
        tone: str,
        category: str,
    ) -> List[str]:
        if output.image_generation_prompts and len(output.image_generation_prompts) >= 2:
            return output.image_generation_prompts[:3]

        tone_map = get_tone_aesthetics(AGENT_ID)
        aesthetic = tone_map.get(tone, tone_map["Professional"])
        direction = output.design_direction or aesthetic
        templates = get_image_prompt_templates(AGENT_ID)
        return [
            render(templates["hero"], product_name=product_name, category=category, direction=direction),
            render(templates["product"], product_name=product_name, tone=tone),
            render(templates["lifestyle"], product_name=product_name, direction=direction),
        ]

    async def _generate_theme_images(
        self,
        output: CommerceCreationOutput,
        product_name: str,
        brand_tone: str,
        category: str,
    ) -> CommerceCreationOutput:
        prompts = self._build_image_prompts(output, product_name, brand_tone, category)
        asset_names = ["hero-1.jpg", "product-1.jpg", "lifestyle-1.jpg"]

        payloads: Dict[str, str] = dict(output.theme_image_payloads or {})
        hero_assets: List[str] = list(output.hero_image_assets or [])
        product_assets: List[str] = list(output.product_image_assets or [])
        hero_urls: List[str] = list(output.hero_image_urls or [])
        product_urls: List[str] = list(output.product_image_urls or [])

        for i, prompt in enumerate(prompts[:3]):
            image_bytes = await research_tools.generate_image_imagen(prompt)
            if not image_bytes:
                logger.warning(f"Imagen failed for prompt {i + 1}, skipping")
                continue
            filename = asset_names[i]
            payloads[filename] = base64.b64encode(image_bytes).decode("ascii")
            data_url = research_tools.image_bytes_to_data_url(image_bytes)
            if i == 0:
                hero_assets.append(filename)
                hero_urls.append(data_url)
            elif i == 1:
                product_assets.append(filename)
                product_urls.append(data_url)
            else:
                product_urls.append(data_url)

        return output.model_copy(update={
            "theme_image_payloads": payloads,
            "hero_image_assets": hero_assets,
            "product_image_assets": product_assets,
            "hero_image_urls": hero_urls,
            "product_image_urls": product_urls,
            "image_generation_prompts": prompts[:3],
        })

    def _build_system_prompt(self, tone: str) -> str:
        tone_map = get_tone_aesthetics(AGENT_ID)
        aesthetic = tone_map.get(tone, tone_map["Professional"])
        return build_system_prompt(AGENT_ID, tone=tone, aesthetic=aesthetic)

    def _build_user_prompt(
        self,
        product_data: ProductIntelligenceOutput,
        competitor_data: CompetitorIntelligenceOutput,
        sourcing_data: ProductSourcingOutput,
        brand_context: str,
        marketing_context: str,
        tone: str,
        retail_price: str,
    ) -> str:
        product_block = render_user_block(
            AGENT_ID,
            "product",
            product_name=product_data.product_name,
            product_category=product_data.product_category,
            trend_score=product_data.trend_score,
            demand_score=product_data.demand_score,
            competition_score=product_data.competition_score,
            estimated_margin=product_data.estimated_margin,
            risk_level=product_data.risk_level,
            reasoning=product_data.reasoning[:400],
        )
        sourcing_block = render_user_block(
            AGENT_ID,
            "sourcing",
            supplier_name=sourcing_data.best_option.supplier_name,
            platform=sourcing_data.best_option.platform,
            unit_cost=sourcing_data.best_option.price_per_unit,
            shipping_time=sourcing_data.best_option.shipping_time,
            retail_price=retail_price,
            profit_margin=sourcing_data.profit_margin_estimate,
        )
        competitor_block = render_user_block(
            AGENT_ID,
            "competitor",
            competitor_context=self._competitor_context(competitor_data),
        )
        brand_block = (
            render_user_block(AGENT_ID, "brand", brand_context=brand_context)
            if brand_context
            else ""
        )

        prompt = build_user_prompt(
            AGENT_ID,
            product_block=product_block,
            sourcing_block=sourcing_block,
            competitor_block=competitor_block,
            marketing_context=marketing_context,
            brand_block=brand_block,
            tone=tone,
            product_name=product_data.product_name,
            retail_price=retail_price,
        )
        max_chars = get_max_prompt_chars(AGENT_ID)
        if len(prompt) > max_chars:
            prompt = prompt[:max_chars]
        return prompt

    async def run(
        self,
        product_data: ProductIntelligenceOutput,
        competitor_data: CompetitorIntelligenceOutput,
        sourcing_data: ProductSourcingOutput,
        initial_input: Optional[Dict[str, Any]] = None,
        meta_ads_data: Optional[MetaAdsSpyOutput] = None,
    ) -> CommerceCreationOutput:
        """Generate uploadable premium Shopify OS 2.0 theme configuration and assets."""
        initial_input = initial_input or {}
        logger.info(f"Starting premium Store Builder for: {product_data.product_name}")

        if not meta_ads_data:
            logger.warning("Ad Creative data not found — theme copy will be inferred from product intel.")

        tone = initial_input.get("brand_tone", "Professional")
        if isinstance(tone, str):
            tone = tone.strip().title() or "Professional"

        retail_price = self._suggested_retail_price(sourcing_data)
        system_prompt = self._build_system_prompt(tone)
        user_prompt = self._build_user_prompt(
            product_data,
            competitor_data,
            sourcing_data,
            self._build_brand_context(initial_input),
            self._marketing_context(meta_ads_data),
            tone,
            retail_price,
        )

        llm_cfg = get_llm_config(AGENT_ID)
        output, provider = await call_with_fallback(
            AGENT_ID,
            system_prompt,
            user_prompt,
            CommerceCreationOutput,
            "system_run",
            temperature=llm_cfg.get("temperature", 0.45),
            model_name=settings.GEMINI_THEME_MODEL,
        )

        output = self._enrich_output(output, product_data.product_name, sourcing_data, meta_ads_data)
        output = await self._generate_theme_images(
            output,
            product_data.product_name,
            tone,
            product_data.product_category,
        )

        log_dir = (output.design_direction or "")[:80]
        logger.info(f"Premium Store Builder completed using {provider} | direction: {log_dir}")
        return output
