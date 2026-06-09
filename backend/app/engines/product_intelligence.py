import logging
import json
from typing import Dict, Any, List
from ..models.schemas import ProductIntelligenceOutput
from ..core.llm import call_with_fallback
from ..core.tools import research_tools

logger = logging.getLogger(__name__)

MAX_PROMPT_CHARS = 3500


class ProductIntelligenceEngine:
    def __init__(self):
        self.research_summary = []  # Populated during run() for the UI

    def _prune_data(self, data: Any, max_chars: int = 150) -> Any:
        if isinstance(data, dict):
            return {k: self._prune_data(v, max_chars) for k, v in data.items()}
        elif isinstance(data, list):
            return [self._prune_data(i, max_chars) for i in data]
        elif isinstance(data, str):
            return data[:max_chars].strip() + "..." if len(data) > max_chars else data
        return data

    def _extract_key_fields(self, items: List[Dict], keys: List[str], max_items: int = 2) -> List[Dict]:
        extracted = []
        for item in items[:max_items]:
            if isinstance(item, dict):
                extracted.append({k: item.get(k, "") for k in keys if item.get(k)})
        return extracted

    def _build_research_summary(self, web: list, tiktok: list, reddit: list, urls: list) -> List[Dict]:
        """Build a structured summary of research sources for the frontend."""
        summary = []
        
        if web:
            summary.append({
                "source": "🌐 Web Search",
                "count": len(web),
                "status": "found",
                "highlights": [r.get("title", "")[:80] for r in web[:3] if r.get("title")]
            })
        else:
            summary.append({"source": "🌐 Web Search", "count": 0, "status": "not_found", "highlights": []})

        if tiktok:
            summary.append({
                "source": "🎵 TikTok Shop",
                "count": len(tiktok),
                "status": "found",
                "highlights": [
                    f"{r.get('title', '')[:50]} — {r.get('avg_price', 'N/A')}"
                    for r in tiktok[:3] if r.get("title")
                ]
            })
        else:
            summary.append({"source": "🎵 TikTok Shop", "count": 0, "status": "not_found", "highlights": []})

        if reddit:
            summary.append({
                "source": "💬 Reddit",
                "count": len(reddit),
                "status": "found",
                "highlights": [r.get("title", "")[:80] for r in reddit[:3] if r.get("title")]
            })
        else:
            summary.append({"source": "💬 Reddit", "count": 0, "status": "not_found", "highlights": []})

        if urls:
            summary.append({
                "source": "🔗 Direct URLs",
                "count": len(urls),
                "status": "found",
                "highlights": [u.get("url", "")[:60] for u in urls[:2]]
            })

        return summary

    async def run(self, input_data: Dict[str, Any]) -> ProductIntelligenceOutput:
        query = input_data.get('query', 'trending e-commerce products')
        target_urls = input_data.get('target_urls', [])
        logger.info(f"Starting Product Discovery for: {query}")

        web_results = await research_tools.search_web(query, max_results=2)
        tiktok_shop_results = await research_tools.search_tiktok_shop(query, max_items=2)
        reddit_results = await research_tools.deep_reddit_search(query, max_items=2)

        url_insights = []
        for url in target_urls[:2]:
            logger.info(f"Grounding analysis with direct URL: {url}")
            scrape_data = await research_tools.scrape_url_grounding(url)
            url_insights.append({
                "url": url,
                "content": (scrape_data.get("markdown", "") or "")[:200]
            })

        # Build research summary for UI BEFORE pruning
        self.research_summary = self._build_research_summary(
            web_results, tiktok_shop_results, reddit_results, url_insights
        )

        if not any([web_results, tiktok_shop_results, reddit_results, url_insights]):
            logger.error("No research data found for query.")
            raise ValueError(f"No research data found for '{query}'. Please try a different query.")

        web_slim = self._extract_key_fields(web_results, ["title", "url", "content"], max_items=2)
        tiktok_slim = self._extract_key_fields(
            tiktok_shop_results,
            ["title", "avg_price", "total_sales", "reviews_count", "category"],
            max_items=2
        )
        reddit_slim = self._extract_key_fields(reddit_results, ["title", "url", "content"], max_items=2)

        research_context = self._prune_data({
            "web": web_slim, "tiktok": tiktok_slim, "reddit": reddit_slim, "urls": url_insights
        }, max_chars=120)

        condensed_persona = "You are a product research analyst. Decisive, data-driven, expert in e-commerce market trends."
        system_prompt = (
            f"{condensed_persona}\n"
            "Identify a 'Tier-1' commerce opportunity. "
            "\n\nCRITICAL: trend_score, demand_score, and competition_score MUST be INTEGERS between 0 and 100. "
            "\nDO NOT return decimals like 0.99. Return 99."
            "\n\nOUTPUT: Valid JSON only. Raw numbers. No units."
            "\nSCHEMA:"
            "\n{\"product_name\":\"\",\"product_category\":\"\",\"trend_score\":85,\"demand_score\":90,\"competition_score\":30,\"estimated_margin\":45.0,\"risk_level\":\"Low\",\"evidence_sources\":[],\"reasoning\":\"\"}"
        )

        data_json = json.dumps(research_context, separators=(',', ':'))
        max_data_chars = MAX_PROMPT_CHARS - len(f"TARGET:{query}\nTASK:Pick best product. Return JSON (Integers for scores).\nDATA:")
        if len(data_json) > max_data_chars:
            data_json = data_json[:max_data_chars]

        user_prompt = f"TARGET:{query}\nDATA:{data_json}\nTASK:Pick best product. Return JSON (Integers for scores)."

        logger.info(f"Product Discovery prompt size: system={len(system_prompt)} user={len(user_prompt)} chars")

        output, provider = await call_with_fallback(
            "product_intelligence", system_prompt, user_prompt, ProductIntelligenceOutput, "system_run"
        )

        logger.info(f"Product Discovery completed using {provider}")
        return output
