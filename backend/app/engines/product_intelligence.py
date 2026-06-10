import asyncio
import logging
import json
from typing import Dict, Any, List, Callable, Awaitable, Optional
from ..models.schemas import ProductIntelligenceOutput
from ..core.llm import call_with_fallback
from ..core.prompt_loader import build_system_prompt, build_user_prompt, get_max_prompt_chars, get_user_task
from ..core.tools import research_tools
from ..core.result_normalizer import (
    MAX_ROWS,
    normalize_product_candidates,
    mark_recommended_product,
)

logger = logging.getLogger(__name__)

AGENT_ID = "product_intelligence"
ProgressCallback = Callable[[str, int], Awaitable[None]]


class ProductIntelligenceEngine:
    def __init__(self):
        self.research_summary: List[Dict] = []
        self.product_candidates: List[Dict[str, Any]] = []

    def _prune_data(self, data: Any, max_chars: int = 150) -> Any:
        if isinstance(data, dict):
            return {k: self._prune_data(v, max_chars) for k, v in data.items()}
        if isinstance(data, list):
            return [self._prune_data(i, max_chars) for i in data]
        if isinstance(data, str):
            return data[:max_chars].strip() + "..." if len(data) > max_chars else data
        return data

    def _build_research_summary(
        self, web: list, tiktok: list, reddit: list, amazon: list, urls: list
    ) -> List[Dict]:
        summary = []

        def _row(label: str, icon: str, items: list, highlight_fn):
            if items:
                summary.append({
                    "source": f"{icon} {label}",
                    "count": len(items),
                    "status": "found",
                    "highlights": highlight_fn(items),
                })
            else:
                summary.append({"source": f"{icon} {label}", "count": 0, "status": "not_found", "highlights": []})

        _row("Web Search", "🌐", web, lambda r: [
            f"{x.get('title', '')[:50]} — {x.get('url', '')[:40]}" for x in r[:3] if x.get("title")
        ])
        _row("TikTok Shop", "🎵", tiktok, lambda r: [
            f"{x.get('title', '')[:50]} — {x.get('avg_price', 'N/A')}" for x in r[:3] if x.get("title")
        ])
        _row("Reddit", "💬", reddit, lambda r: [x.get("title", "")[:80] for x in r[:3] if x.get("title")])
        _row("Amazon", "📦", amazon, lambda r: [
            f"{x.get('title', '')[:50]} — {x.get('url', '')[:40]}" for x in r[:3] if x.get("title")
        ])

        if urls:
            summary.append({
                "source": "🔗 Direct URLs",
                "count": len(urls),
                "status": "found",
                "highlights": [u.get("url", "")[:60] for u in urls[:3]],
            })

        return summary

    async def run(
        self,
        input_data: Dict[str, Any],
        run_id: str = "system_run",
        on_progress: Optional[ProgressCallback] = None,
    ) -> ProductIntelligenceOutput:
        query = input_data.get("query") or input_data.get("product_name") or "trending e-commerce products"
        target_urls = input_data.get("target_urls", [])
        logger.info(f"Starting Product Discovery for: {query}")

        async def progress(msg: str, pct: int):
            if on_progress:
                await on_progress(msg, pct)

        await progress("Searching web trends (Tavily / SerpAPI)...", 15)

        web_task = research_tools.search_web(query, max_results=MAX_ROWS)
        amazon_task = research_tools.scrape_amazon_products(query, max_items=MAX_ROWS)
        tiktok_task = research_tools.search_tiktok_shop(query, max_items=MAX_ROWS)
        reddit_task = research_tools.deep_reddit_search(query, max_items=MAX_ROWS)

        web_results, amazon_results, tiktok_shop_results, reddit_results = await asyncio.gather(
            web_task, amazon_task, tiktok_task, reddit_task, return_exceptions=True,
        )

        def _safe(result, label: str) -> list:
            if isinstance(result, Exception):
                logger.error(f"{label} failed: {result}")
                return []
            return result or []

        web_results = _safe(web_results, "Web search")
        amazon_results = _safe(amazon_results, "Amazon search")
        tiktok_shop_results = _safe(tiktok_shop_results, "TikTok Shop")
        reddit_results = _safe(reddit_results, "Reddit")

        await progress(
            f"Found {len(web_results)} web, {len(tiktok_shop_results)} TikTok, "
            f"{len(reddit_results)} Reddit, {len(amazon_results)} Amazon signals",
            55,
        )

        url_insights = []
        for url in target_urls[:3]:
            await progress(f"Scraping URL: {url[:50]}...", 60)
            scrape_data = await research_tools.scrape_url_grounding(url)
            url_insights.append({
                "url": url,
                "content": research_tools._extract_markdown(scrape_data)[:200],
            })

        candidates = normalize_product_candidates(
            web_results, amazon_results, tiktok_shop_results, reddit_results, url_insights
        )

        self.research_summary = self._build_research_summary(
            web_results, tiktok_shop_results, reddit_results, amazon_results, url_insights
        )

        if not candidates and not any([web_results, tiktok_shop_results, reddit_results, amazon_results, url_insights]):
            raise ValueError(
                f"No research data found for '{query}'. Check TAVILY_API_KEY or APIFY_API_KEY in backend .env."
            )

        candidates_for_llm = [c.model_dump() for c in candidates[:MAX_ROWS]]
        research_context = self._prune_data({"candidates": candidates_for_llm}, max_chars=200)

        await progress("Analyzing signals with AI...", 75)

        system_prompt = build_system_prompt(AGENT_ID)
        task = get_user_task(AGENT_ID)
        max_prompt_chars = get_max_prompt_chars(AGENT_ID)

        data_json = json.dumps(research_context, separators=(",", ":"))
        user_prefix = f"TARGET:{query}\nTASK:{task}\nDATA:"
        max_data_chars = max_prompt_chars - len(user_prefix)
        if len(data_json) > max_data_chars:
            data_json = data_json[:max_data_chars]

        user_prompt = build_user_prompt(AGENT_ID, query=query, data_json=data_json, task=task)

        output, provider = await call_with_fallback(
            AGENT_ID, system_prompt, user_prompt, ProductIntelligenceOutput, run_id
        )

        self.product_candidates = mark_recommended_product(candidates, output.product_name)

        await progress(f"Product identified: {output.product_name}", 100)
        logger.info(f"Product Discovery completed using {provider} — {len(self.product_candidates)} candidates")
        return output
