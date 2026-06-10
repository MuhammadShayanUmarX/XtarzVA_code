import logging
import json
from typing import Dict, Any, List, Optional

from ..models.schemas import (
    MetaAdsSpyOutput,
    TrackedAd,
    ProductIntelligenceOutput,
    CompetitorIntelligenceOutput,
    ProductSourcingOutput,
)
from ..core.llm import call_with_fallback
from ..core.prompt_loader import (
    build_system_prompt,
    build_user_prompt,
    get_image_prompt_templates,
    get_max_prompt_chars,
    get_user_task,
    render,
)
from ..core.tools import research_tools

logger = logging.getLogger(__name__)

AGENT_ID = "meta_ads_spy"


class MetaAdsSpyEngine:
    def __init__(self):
        self.research_summary = []

    async def run(
        self,
        query: str,
        initial_input: Optional[Dict[str, Any]] = None,
        product_data: Optional[ProductIntelligenceOutput] = None,
        competitor_data: Optional[CompetitorIntelligenceOutput] = None,
        sourcing_data: Optional[ProductSourcingOutput] = None,
    ) -> MetaAdsSpyOutput:
        initial_input = initial_input or {}
        logger.info(f"Starting Ad Creative for: {query}")

        ad_research = await research_tools.search_meta_ads(query, max_results=5)
        stock_photos = await research_tools.search_unsplash_photos(query, max_items=2)

        self.research_summary = []
        if ad_research:
            self.research_summary.append({
                "source": "Meta Ad Research",
                "count": len(ad_research),
                "status": "found",
                "highlights": [
                    r.get("title", r.get("content", ""))[:80]
                    for r in ad_research[:3]
                    if r.get("title") or r.get("content")
                ],
            })
        else:
            self.research_summary.append({
                "source": "Meta Ad Research",
                "count": 0,
                "status": "not_found",
                "highlights": [],
            })

        research_context = [
            {
                "title": r.get("title", ""),
                "url": r.get("url", ""),
                "snippet": (r.get("content", "") or "")[:200],
            }
            for r in ad_research[:3]
        ]

        context_parts = [f"Product/niche: {query}"]
        if product_data:
            context_parts.append(
                f"Intel: {product_data.product_name}, category={product_data.product_category}, "
                f"trend={product_data.trend_score}, margin={product_data.estimated_margin}%"
            )
        if competitor_data:
            context_parts.append(
                f"Competitor gaps: {', '.join(competitor_data.competitor_weaknesses[:2])}"
            )
        if sourcing_data:
            context_parts.append(
                f"Sourcing: ${sourcing_data.best_option.price_per_unit}/unit, "
                f"margin={sourcing_data.profit_margin_estimate}%"
            )

        system_prompt = build_system_prompt(AGENT_ID)
        task = get_user_task(AGENT_ID)
        max_prompt_chars = get_max_prompt_chars(AGENT_ID)

        brief_parts = []
        if initial_input.get("target_audience"):
            brief_parts.append(f"Target audience: {initial_input['target_audience']}")
        if initial_input.get("ad_angle"):
            brief_parts.append(f"Ad angle: {initial_input['ad_angle']}")
        if initial_input.get("budget_tier"):
            brief_parts.append(f"Budget tier: {initial_input['budget_tier']}")
        if initial_input.get("brand_tone"):
            brief_parts.append(f"Brand tone: {initial_input['brand_tone']}")

        data_json = json.dumps(research_context, separators=(",", ":"))
        if len(data_json) > 1500:
            data_json = data_json[:1500]

        brief_block = f"BRIEF:\n" + "\n".join(brief_parts) + "\n" if brief_parts else ""
        user_prompt = build_user_prompt(
            AGENT_ID,
            context="\n".join(context_parts) + "\n",
            brief_block=brief_block,
            data_json=data_json,
            task=task,
        )

        if len(user_prompt) > max_prompt_chars:
            user_prompt = user_prompt[:max_prompt_chars]

        output, provider = await call_with_fallback(
            AGENT_ID, system_prompt, user_prompt, MetaAdsSpyOutput, "system_run"
        )

        if not output.product_creative_description_html and output.product_creative_description:
            bullets = "".join(f"<li>{b}</li>" for b in output.bullet_benefits)
            output = output.model_copy(update={
                "product_creative_description_html": (
                    f"<p>{output.product_creative_description}</p>"
                    + (f"<ul>{bullets}</ul>" if bullets else "")
                )
            })

        creative_urls: List[str] = []
        image_templates = get_image_prompt_templates(AGENT_ID)
        prompts = output.creative_image_prompts or [
            render(image_templates["fallback_ad"], query=query),
            render(image_templates["fallback_lifestyle"], query=query),
        ]
        for i, prompt in enumerate(prompts[:3]):
            image_bytes = await research_tools.generate_image_imagen(prompt)
            if image_bytes:
                creative_urls.append(research_tools.image_bytes_to_data_url(image_bytes))
            elif i < len(stock_photos):
                creative_urls.append(stock_photos[i])

        enriched_ads: List[TrackedAd] = []
        image_pool = list(creative_urls) + list(stock_photos)
        for i, ad in enumerate(output.active_ads):
            if ad.ad_image_url:
                enriched_ads.append(ad)
                continue
            url = image_pool[i] if i < len(image_pool) else ""
            if not url:
                img_bytes = await research_tools.generate_image_imagen(
                    render(
                        image_templates["fallback_hook"],
                        query=query,
                        hook_text=ad.hook_text or ad.ad_copy[:80],
                    )
                )
                url = research_tools.image_bytes_to_data_url(img_bytes) if img_bytes else ""
            enriched_ads.append(ad.model_copy(update={"ad_image_url": url}))

        output = output.model_copy(update={
            "active_ads": enriched_ads,
            "creative_image_urls": creative_urls,
            "creative_image_prompts": prompts[:3],
        })

        if not output.ad_copy_hooks and output.winning_hooks:
            output = output.model_copy(update={"ad_copy_hooks": output.winning_hooks})

        logger.info(f"Ad Creative completed using {provider}")
        return output
