import logging
import json
from typing import Dict, Any, List, Optional
from ..models.schemas import MetaAdsSpyOutput, TrackedAd
from ..core.llm import call_with_fallback
from ..core.tools import research_tools

logger = logging.getLogger(__name__)

MAX_PROMPT_CHARS = 3500


class MetaAdsSpyEngine:
    def __init__(self):
        self.research_summary = []

    async def run(self, query: str, initial_input: Optional[Dict[str, Any]] = None) -> MetaAdsSpyOutput:
        initial_input = initial_input or {}
        logger.info(f"Starting Ad Creative for: {query}")

        ad_research = await research_tools.search_meta_ads(query, max_results=5)
        stock_photos = await research_tools.search_unsplash_photos(query, max_items=3)

        self.research_summary = []
        if ad_research:
            self.research_summary.append({
                "source": "📣 Meta Ad Research",
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
                "source": "📣 Meta Ad Research",
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

        system_prompt = (
            "You are a Meta Ads Intelligence Agent. Use the provided ad research signals to generate "
            "realistic, high-performing ad creatives, hooks, and strategy.\n\n"
            "OUTPUT: Valid JSON only.\n"
            "SCHEMA:\n"
            "{\n"
            '  "top_competitors_tracked": ["Brand A", "Brand B"],\n'
            '  "active_ads": [\n'
            "    {\n"
            '      "brand_name": "Brand A",\n'
            '      "ad_copy": "Stop struggling with X. Introducing Y...",\n'
            '      "media_type": "Image",\n'
            '      "estimated_spend": 15000.0,\n'
            '      "performance_score": 95,\n'
            '      "hook_text": "Why everyone is switching to Y...",\n'
            '      "ad_image_url": ""\n'
            "    }\n"
            "  ],\n"
            '  "winning_hooks": ["Hook 1", "Hook 2"],\n'
            '  "recommended_strategy": "Focus on UGC video ads highlighting the primary pain point."\n'
            "}\n"
            "Leave ad_image_url empty — images are attached after generation."
        )

        data_json = json.dumps(research_context, separators=(",", ":"))
        if len(data_json) > MAX_PROMPT_CHARS - 200:
            data_json = data_json[: MAX_PROMPT_CHARS - 200]

        brief_parts = []
        if initial_input.get("target_audience"):
            brief_parts.append(f"Target audience: {initial_input['target_audience']}")
        if initial_input.get("ad_angle"):
            brief_parts.append(f"Ad angle: {initial_input['ad_angle']}")
        if initial_input.get("budget_tier"):
            brief_parts.append(f"Budget tier: {initial_input['budget_tier']}")
        brief = "\n".join(brief_parts)

        user_prompt = (
            f"Niche/product: {query}\n"
            + (f"BRIEF:\n{brief}\n" if brief else "")
            + f"RESEARCH:{data_json}\n"
            "TASK: Generate MetaAdsSpyOutput JSON based on real research signals."
        )

        output, provider = await call_with_fallback(
            "meta_ads_spy", system_prompt, user_prompt, MetaAdsSpyOutput, "system_run"
        )

        image_pool = list(stock_photos)
        enriched_ads: List[TrackedAd] = []
        for i, ad in enumerate(output.active_ads):
            if ad.ad_image_url:
                enriched_ads.append(ad)
                continue
            if i < len(image_pool):
                enriched_ads.append(ad.model_copy(update={"ad_image_url": image_pool[i]}))
            else:
                prompt = f"professional Meta ad creative for {query}, {ad.hook_text or ad.ad_copy[:80]}"
                enriched_ads.append(
                    ad.model_copy(update={"ad_image_url": research_tools.generate_image_url(prompt)})
                )
        output = output.model_copy(update={"active_ads": enriched_ads})

        logger.info(f"Ad Creative completed using {provider}")
        return output
