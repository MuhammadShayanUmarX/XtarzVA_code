import asyncio
import logging
import json
from typing import Dict, Any, List, Callable, Awaitable, Optional
from ..models.schemas import ProductIntelligenceOutput
from ..core.llm import call_with_fallback
from ..core.tools import research_tools

logger = logging.getLogger(__name__)

MAX_PROMPT_CHARS = 3500
ProgressCallback = Callable[[str, int], Awaitable[None]]


class ProductIntelligenceEngine:
    def __init__(self):
        self.research_summary: List[Dict] = []

    def _prune_data(self, data: Any, max_chars: int = 150) -> Any:
        if isinstance(data, dict):
            return {k: self._prune_data(v, max_chars) for k, v in data.items()}
        if isinstance(data, list):
            return [self._prune_data(i, max_chars) for i in data]
        if isinstance(data, str):
            return data[:max_chars].strip() + "..." if len(data) > max_chars else data
        return data

    def _extract_key_fields(self, items: List[Dict], keys: List[str], max_items: int = 2) -> List[Dict]:
        extracted = []
        for item in items[:max_items]:
            if isinstance(item, dict):
                extracted.append({k: item.get(k, "") for k in keys if item.get(k)})
        return extracted

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

        _row("Web Search", "🌐", web, lambda r: [x.get("title", "")[:80] for x in r[:3] if x.get("title")])
        _row("TikTok Shop", "🎵", tiktok, lambda r: [
            f"{x.get('title', '')[:50]} — {x.get('avg_price', 'N/A')}" for x in r[:3] if x.get("title")
        ])
        _row("Reddit", "💬", reddit, lambda r: [x.get("title", "")[:80] for x in r[:3] if x.get("title")])
        _row("Amazon", "📦", amazon, lambda r: [x.get("title", "")[:80] for x in r[:3] if x.get("title")])

        if urls:
            summary.append({
                "source": "🔗 Direct URLs",
                "count": len(urls),
                "status": "found",
                "highlights": [u.get("url", "")[:60] for u in urls[:2]],
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

        web_task = research_tools.search_web(query, max_results=3)
        amazon_task = research_tools.scrape_amazon_products(query, max_items=3)
        tiktok_task = research_tools.search_tiktok_shop(query, max_items=3)
        reddit_task = research_tools.deep_reddit_search(query, max_items=3)

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
        for url in target_urls[:2]:
            await progress(f"Scraping URL: {url[:50]}...", 60)
            scrape_data = await research_tools.scrape_url_grounding(url)
            url_insights.append({
                "url": url,
                "content": research_tools._extract_markdown(scrape_data)[:200],
            })

        self.research_summary = self._build_research_summary(
            web_results, tiktok_shop_results, reddit_results, amazon_results, url_insights
        )

        if not any([web_results, tiktok_shop_results, reddit_results, amazon_results, url_insights]):
            raise ValueError(
                f"No research data found for '{query}'. Check TAVILY_API_KEY or APIFY_API_KEY in backend .env."
            )

        web_slim = self._extract_key_fields(web_results, ["title", "url", "content"], max_items=2)
        tiktok_slim = self._extract_key_fields(
            tiktok_shop_results,
            ["title", "avg_price", "total_sales", "reviews_count", "category"],
            max_items=2,
        )
        reddit_slim = self._extract_key_fields(reddit_results, ["title", "url", "content"], max_items=2)
        amazon_slim = self._extract_key_fields(amazon_results, ["title", "url", "content"], max_items=2)

        research_context = self._prune_data({
            "web": web_slim,
            "tiktok": tiktok_slim,
            "reddit": reddit_slim,
            "amazon": amazon_slim,
            "urls": url_insights,
        }, max_chars=120)

        await progress("Analyzing signals with AI...", 75)

        condensed_persona = "You are a product research analyst. Decisive, data-driven, expert in e-commerce market trends."
        system_prompt = (
            f"{condensed_persona}\n"
            "Identify a 'Tier-1' commerce opportunity from the research data. "
            "\n\nCRITICAL: trend_score, demand_score, and competition_score MUST be INTEGERS between 0 and 100. "
            "\nDO NOT return decimals like 0.99. Return 99."
            "\n\nOUTPUT: Valid JSON only. Raw numbers. No units."
            "\nSCHEMA:"
            "\n{\"product_name\":\"\",\"product_category\":\"\",\"trend_score\":85,\"demand_score\":90,"
            "\"competition_score\":30,\"estimated_margin\":45.0,\"risk_level\":\"Low\",\"evidence_sources\":[],\"reasoning\":\"\"}"
        )

        data_json = json.dumps(research_context, separators=(",", ":"))
        max_data_chars = MAX_PROMPT_CHARS - len(f"TARGET:{query}\nTASK:Pick best product. Return JSON (Integers for scores).\nDATA:")
        if len(data_json) > max_data_chars:
            data_json = data_json[:max_data_chars]

        user_prompt = f"TARGET:{query}\nDATA:{data_json}\nTASK:Pick best product. Return JSON (Integers for scores)."

        output, provider = await call_with_fallback(
            "product_intelligence", system_prompt, user_prompt, ProductIntelligenceOutput, run_id
        )

        await progress(f"Product identified: {output.product_name}", 100)
        logger.info(f"Product Discovery completed using {provider}")
        return output
