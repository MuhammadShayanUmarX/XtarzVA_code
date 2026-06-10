import logging
import json
from typing import Dict, Any, List, Optional
from ..models.schemas import CompetitorIntelligenceOutput, ProductIntelligenceOutput
from ..core.llm import call_with_fallback
from ..core.tools import research_tools
from ..core.result_normalizer import (
    MAX_ROWS,
    normalize_competitors,
    merge_competitor_profiles,
)

logger = logging.getLogger(__name__)

MAX_PROMPT_CHARS = 3500


class CompetitorIntelligenceEngine:
    def __init__(self):
        self.research_summary: List[Dict] = []
        self.competitor_profiles: List[Dict[str, Any]] = []

    def _prune_data(self, data: Any, max_chars: int = 120) -> Any:
        if isinstance(data, dict):
            return {k: self._prune_data(v, max_chars) for k, v in data.items()}
        elif isinstance(data, list):
            return [self._prune_data(i, max_chars) for i in data]
        elif isinstance(data, str):
            return data[:max_chars].strip() + "..." if len(data) > max_chars else data
        return data

    async def run(
        self,
        product_data: ProductIntelligenceOutput,
        context: Optional[Dict[str, Any]] = None,
    ) -> CompetitorIntelligenceOutput:
        product_name = product_data.product_name
        context = context or {}
        competitor_url = context.get("competitor_url", "").strip()
        logger.info(f"Starting Competitor Intel for: {product_name}")

        amazon_results = await research_tools.scrape_amazon_products(product_name, max_items=MAX_ROWS)
        tiktok_shop_details = await research_tools.search_tiktok_shop(product_name, max_items=MAX_ROWS)

        search_query = f"top shopify competitors for {product_name}"
        web_search = await research_tools.search_serp(search_query, max_results=MAX_ROWS)
        if not web_search:
            web_search = await research_tools.search_web(search_query, max_results=MAX_ROWS)

        competitor_audits = []
        if competitor_url:
            audit = await research_tools.audit_website(competitor_url)
            competitor_audits.append({
                "url": competitor_url,
                "summary": research_tools._extract_markdown(audit)[:300],
            })

        competitor_urls = context.get("competitor_urls") or []
        audit_urls = {competitor_url} if competitor_url else set()
        for extra_url in competitor_urls[:3]:
            if extra_url and extra_url not in audit_urls:
                audit = await research_tools.audit_website(extra_url)
                competitor_audits.append({
                    "url": extra_url,
                    "summary": research_tools._extract_markdown(audit)[:300],
                })
                audit_urls.add(extra_url)

        for result in web_search[:MAX_ROWS]:
            url = result.get("url")
            if url and "amazon" not in url and url not in audit_urls:
                audit = await research_tools.audit_website(url)
                audit_text = research_tools._extract_markdown(audit)[:200]
                competitor_audits.append({"url": url, "summary": audit_text})
                audit_urls.add(url)

        scraped_profiles = normalize_competitors(
            amazon_results, tiktok_shop_details, web_search, competitor_audits
        )

        self.research_summary = []
        if amazon_results:
            self.research_summary.append({
                "source": "🛒 Amazon",
                "count": len(amazon_results),
                "status": "found",
                "highlights": [
                    f"{r.get('title', '')[:50]} — {r.get('url', '')[:40]}"
                    for r in amazon_results[:3] if r
                ],
            })
        else:
            self.research_summary.append({"source": "🛒 Amazon", "count": 0, "status": "not_found", "highlights": []})

        if tiktok_shop_details:
            self.research_summary.append({
                "source": "🎵 TikTok Shop",
                "count": len(tiktok_shop_details),
                "status": "found",
                "highlights": [
                    f"{r.get('title', '')[:50]} — {r.get('avg_price', 'N/A')}"
                    for r in tiktok_shop_details[:3] if r.get("title")
                ],
            })
        else:
            self.research_summary.append({"source": "🎵 TikTok Shop", "count": 0, "status": "not_found", "highlights": []})

        if competitor_audits:
            self.research_summary.append({
                "source": "🔍 Website Audits",
                "count": len(competitor_audits),
                "status": "found",
                "highlights": [a.get("url", "")[:60] for a in competitor_audits],
            })
        else:
            self.research_summary.append({"source": "🔍 Website Audits", "count": 0, "status": "not_found", "highlights": []})

        scraped_for_llm = [p.model_dump() for p in scraped_profiles[:MAX_ROWS]]
        competitor_context = self._prune_data({"competitors": scraped_for_llm}, max_chars=150)

        system_prompt = (
            "You are a competitive intelligence analyst. Analyze competitor data and identify market gaps.\n\n"
            "You MUST return ONLY a JSON object with EXACTLY these 6 keys. No other keys allowed.\n\n"
            "EXACT SCHEMA (copy these field names EXACTLY):\n"
            '{"competitor_weaknesses":["weakness 1","weakness 2"],'
            '"pricing_gaps":["gap 1","gap 2"],'
            '"SEO_gaps":["seo gap 1","seo gap 2"],'
            '"product_opportunities":["opportunity 1","opportunity 2"],'
            '"market_saturation_score":45,'
            '"competitors":[{"store_name":"","store_url":"","platform":"","price":"","price_range":"",'
            '"positioning":"","threat_level":"Low|Medium|High","is_shopify":false,"notes":""}]}\n\n'
            "RULES:\n"
            "- competitors: enrich the provided competitor list with positioning and threat_level\n"
            "- market_saturation_score: integer 0-100\n"
            "- DO NOT add any extra keys"
        )

        data_json = json.dumps(competitor_context, separators=(',', ':'))
        max_data_chars = MAX_PROMPT_CHARS - len(
            f"PRODUCT:{product_name}\nReturn JSON with competitor analysis and competitors array.\nDATA:"
        )
        if len(data_json) > max_data_chars:
            data_json = data_json[:max_data_chars]

        brief_parts = []
        if context.get("niche"):
            brief_parts.append(f"Niche: {context['niche']}")
        if context.get("target_market"):
            brief_parts.append(f"Target market: {context['target_market']}")
        if context.get("competitor_urls"):
            brief_parts.append(f"Competitor URLs: {context['competitor_urls']}")
        elif competitor_url:
            brief_parts.append(f"Competitor URL: {competitor_url}")
        brief = "\n".join(brief_parts)

        user_prompt = (
            f"PRODUCT:{product_name}\n"
            + (f"BRIEF:\n{brief}\n" if brief else "")
            + f"DATA:{data_json}\n"
            "Return JSON with competitor analysis and competitors array."
        )

        output, provider = await call_with_fallback(
            "competitor_intelligence", system_prompt, user_prompt, CompetitorIntelligenceOutput, "system_run"
        )

        self.competitor_profiles = merge_competitor_profiles(scraped_profiles, output.competitors)
        if not self.competitor_profiles and scraped_profiles:
            self.competitor_profiles = [p.model_dump() for p in scraped_profiles]

        logger.info(f"Competitor Intel completed using {provider} — {len(self.competitor_profiles)} profiles")
        return output
