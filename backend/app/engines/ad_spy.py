import json
import logging
from typing import Any, Dict, List, Optional

from ..models.schemas import AdSpyOutput, TrackedAd
from ..core.llm import call_with_fallback
from ..core.prompt_loader import build_system_prompt, build_user_prompt, get_user_task
from ..core.tools import research_tools

logger = logging.getLogger(__name__)

AGENT_ID = "ad_spy"


class AdSpyEngine:
    async def run(
        self,
        query: str,
        brand_filter: Optional[str] = None,
        platform: str = "facebook",
    ) -> tuple[AdSpyOutput, List[Dict[str, Any]]]:
        logger.info("Starting Ad Spy for: %s (platform=%s)", query, platform)

        search_query = query
        if brand_filter:
            search_query = f"{brand_filter} {query}"

        raw_research = await research_tools.search_meta_ads(search_query, max_results=8)

        research_context = [
            {
                "title": r.get("title", ""),
                "url": r.get("url", ""),
                "snippet": (r.get("content", "") or "")[:300],
            }
            for r in raw_research
        ]

        system_prompt = build_system_prompt(AGENT_ID)
        user_prompt = build_user_prompt(
            AGENT_ID,
            query=query,
            brand_filter=brand_filter or "Any",
            platform=platform,
            data_json=json.dumps(research_context, indent=2),
            task=get_user_task(AGENT_ID),
        )

        result, _ = await call_with_fallback(
            AGENT_ID, system_prompt, user_prompt, AdSpyOutput, "ad_spy_run"
        )

        if not result.active_ads and raw_research:
            result.active_ads = [
                TrackedAd(
                    brand_name=brand_filter or query,
                    ad_copy=(r.get("content") or r.get("title") or "")[:400],
                    media_type="Image",
                    estimated_spend=2500.0,
                    performance_score=60,
                    hook_text=(r.get("title") or "")[:120],
                    ad_image_url="",
                )
                for r in raw_research[:5]
                if r.get("title") or r.get("content")
            ]

        return result, raw_research
