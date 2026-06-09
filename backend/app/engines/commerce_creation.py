import logging
from typing import Dict, Any, Optional
from ..models.schemas import (
    CommerceCreationOutput,
    ProductIntelligenceOutput,
    CompetitorIntelligenceOutput,
    ProductSourcingOutput,
)
from ..core.llm import call_with_fallback
from ..core.tools import research_tools

logger = logging.getLogger(__name__)

MAX_PROMPT_CHARS = 3500


class CommerceCreationEngine:
    def _build_brand_context(self, initial_input: Optional[Dict[str, Any]]) -> str:
        if not initial_input:
            return ""
        parts = []
        field_labels = {
            "target_audience": "Target audience",
            "brand_tone": "Brand tone",
            "price_range": "Price positioning",
            "competitor_url": "Competitor reference",
            "selling_points": "Key selling points",
            "niche": "Niche",
        }
        for key, label in field_labels.items():
            val = initial_input.get(key, "").strip() if isinstance(initial_input.get(key), str) else initial_input.get(key)
            if val:
                parts.append(f"{label}: {val}")
        return "\n".join(parts)

    def _enrich_output(self, output: CommerceCreationOutput, product_name: str) -> CommerceCreationOutput:
        """Fill Shopify-ready defaults when the LLM omits optional fields."""
        title = output.product_title or (output.seo_titles[0] if output.seo_titles else product_name)
        if not output.product_description_html and output.product_description:
            bullets = "".join(f"<li>{b}</li>" for b in output.bullet_benefits)
            output.product_description_html = (
                f"<p>{output.product_description}</p>"
                + (f"<ul>{bullets}</ul>" if bullets else "")
            )
        if not output.seo_meta_title:
            output.seo_meta_title = title[:70]
        if not output.seo_meta_description:
            output.seo_meta_description = output.product_description[:160]
        if not output.product_title:
            output.product_title = title
        if not output.collection_title:
            output.collection_title = f"{product_name} Collection"
        if not output.homepage_hero_headline:
            output.homepage_hero_headline = title
        if not output.variants:
            price = "29.99"
            output.variants = [{"title": "Default", "price": price, "sku": ""}]
        return output

    async def run(
        self,
        product_data: ProductIntelligenceOutput,
        competitor_data: CompetitorIntelligenceOutput,
        sourcing_data: ProductSourcingOutput,
        initial_input: Optional[Dict[str, Any]] = None,
    ) -> CommerceCreationOutput:
        """
        Generate complete Shopify-ready store launch assets.
        Optimized for Groq Free Tier (6k TPM) — sends condensed strategic inputs.
        """
        initial_input = initial_input or {}
        logger.info(f"Starting Store Builder for: {product_data.product_name}")

        product_summary = (
            f"Product: {product_data.product_name} ({product_data.product_category}), "
            f"Trend:{product_data.trend_score}, Demand:{product_data.demand_score}, "
            f"Competition:{product_data.competition_score}, Margin:{product_data.estimated_margin}%, "
            f"Risk:{product_data.risk_level}"
        )

        competitor_summary = (
            f"Weaknesses: {', '.join(competitor_data.competitor_weaknesses[:3])}. "
            f"Pricing gaps: {', '.join(competitor_data.pricing_gaps[:2])}. "
            f"SEO gaps: {', '.join(competitor_data.SEO_gaps[:2])}. "
            f"Saturation: {competitor_data.market_saturation_score}/100"
        )

        sourcing_summary = (
            f"Best supplier: {sourcing_data.best_option.supplier_name} ({sourcing_data.best_option.platform}), "
            f"${sourcing_data.best_option.price_per_unit}/unit, "
            f"MOQ:{sourcing_data.best_option.moq}, "
            f"Ship:{sourcing_data.best_option.shipping_time}, "
            f"Margin est:{sourcing_data.profit_margin_estimate}%"
        )

        brand_context = self._build_brand_context(initial_input)
        tone = initial_input.get("brand_tone", "Professional")

        condensed_persona = (
            f"You are a Shopify store expert and conversion copywriter. Build a cohesive, "
            f"{tone.lower()} brand presence with SEO-optimized listings, collection pages, and homepage copy. "
            "Focus on: emotional copy, SEO titles, scroll-stopping hooks, and premium photorealistic image prompts."
        )

        system_prompt = (
            f"{condensed_persona}\n"
            "\nCRITICAL RULES FOR IMAGE PROMPTS:"
            "\n- Create extremely detailed, photorealistic, professional product photography prompts for Pollinations AI."
            "\n- Specify high-end photography details (e.g., 'studio lighting', 'minimalist aesthetic', 'shot on 85mm lens')."
            "\n- Focus on the main product and its key benefits. Do NOT include human faces."
            "\n\nRETURN ONLY valid JSON matching this schema:"
            "\n{"
            '\n  "product_title": "Primary Shopify product title",'
            '\n  "seo_titles": ["3 SEO-optimized titles"],'
            '\n  "seo_meta_title": "60-char meta title",'
            '\n  "seo_meta_description": "155-char meta description",'
            '\n  "product_description": "Plain-text compelling description",'
            '\n  "product_description_html": "<p>HTML description with <ul><li>benefits</li></ul></p>",'
            '\n  "bullet_benefits": ["5 key benefits"],'
            '\n  "tags": ["shopify tags"],'
            '\n  "variants": [{"title":"Default","price":"29.99","compare_at_price":"39.99","sku":""}],'
            '\n  "collection_title": "Collection name",'
            '\n  "collection_description": "Collection page copy",'
            '\n  "homepage_hero_headline": "Homepage hero headline",'
            '\n  "homepage_hero_subheadline": "Hero subheadline with CTA angle",'
            '\n  "about_page_snippet": "2-3 paragraph about page for the brand",'
            '\n  "faqs": [{"question":"","answer":""}],'
            '\n  "ad_copy_hooks": ["3 scroll-stopping hooks"],'
            '\n  "ugc_scripts": ["2 short UGC video scripts"],'
            '\n  "image_generation_prompts": ["2 detailed photorealistic image prompts"],'
            '\n  "store_theme_json": {"hero":{"headline":"","subheadline":""},"colors":{"primary":"#1a1a2e","accent":"#e94560"}}'
            "\n}"
        )

        user_prompt = (
            f"INPUTS:\n"
            f"- {product_summary}\n"
            f"- {competitor_summary}\n"
            f"- {sourcing_summary}\n"
        )
        if brand_context:
            user_prompt += f"- BRAND BRIEF:\n{brand_context}\n"
        user_prompt += "\nTASK: Build a complete Shopify store package. Return JSON."

        if len(user_prompt) > MAX_PROMPT_CHARS:
            logger.warning(f"Commerce creation prompt ({len(user_prompt)} chars) exceeds budget. Truncating.")
            user_prompt = user_prompt[:MAX_PROMPT_CHARS]

        logger.info(f"Store Builder prompt size: system={len(system_prompt)} user={len(user_prompt)} chars")

        output, provider = await call_with_fallback(
            "commerce_creation",
            system_prompt,
            user_prompt,
            CommerceCreationOutput,
            "system_run",
        )

        output = self._enrich_output(output, product_data.product_name)

        if output.image_generation_prompts:
            logger.info(f"Generating {len(output.image_generation_prompts)} product images")
            output.generated_image_urls = [
                research_tools.generate_image_url(prompt)
                for prompt in output.image_generation_prompts
            ]

        try:
            unsplash_query = product_data.product_name
            logger.info(f"Searching Unsplash for: {unsplash_query}")
            unsplash_urls = await research_tools.search_unsplash_photos(unsplash_query, max_items=2)
            if unsplash_urls:
                output.generated_image_urls.extend(unsplash_urls)
        except Exception as e:
            logger.error(f"Failed to fetch Unsplash stock photos: {str(e)}")

        logger.info(f"Store Builder completed using {provider}")
        return output
