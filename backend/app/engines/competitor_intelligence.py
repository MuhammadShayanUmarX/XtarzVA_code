import logging
import json
from typing import Dict, Any, List
from ..models.schemas import CompetitorIntelligenceOutput, ProductIntelligenceOutput
from ..core.llm import call_with_fallback
from ..core.tools import research_tools

logger = logging.getLogger(__name__)

MAX_PROMPT_CHARS = 3500


class CompetitorIntelligenceEngine:
    def __init__(self):
        self.research_summary = []

    def _prune_data(self, data: Any, max_chars: int = 120) -> Any:
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

    async def run(self, product_data: ProductIntelligenceOutput) -> CompetitorIntelligenceOutput:
        product_name = product_data.product_name
        logger.info(f"Starting Competitor Intel for: {product_name}")

        amazon_results = await research_tools.scrape_amazon_products(product_name, max_items=2)
        tiktok_shop_details = await research_tools.get_tiktok_shop_details(product_name)

        search_query = f"top shopify competitors for {product_name}"
        web_search = await research_tools.search_web(search_query, max_results=2)

        competitor_audits = []
        for result in web_search[:2]:
            url = result.get("url")
            if url and "amazon" not in url:
                audit = await research_tools.audit_website(url)
                audit_text = (audit.get("markdown", "") or "")[:200] if isinstance(audit, dict) else ""
                competitor_audits.append({"url": url, "summary": audit_text})

        # Build research summary for UI
        self.research_summary = []
        if amazon_results:
            self.research_summary.append({
                "source": "🛒 Amazon",
                "count": len(amazon_results),
                "status": "found",
                "highlights": [r.get("title", r.get("content", ""))[:80] for r in amazon_results[:3] if r]
            })
        else:
            self.research_summary.append({"source": "🛒 Amazon", "count": 0, "status": "not_found", "highlights": []})

        if tiktok_shop_details:
            self.research_summary.append({
                "source": "🎵 TikTok Shop",
                "count": len(tiktok_shop_details),
                "status": "found",
                "highlights": [f"{r.get('title', '')[:50]} — {r.get('price', 'N/A')}" for r in tiktok_shop_details[:3] if r.get("title")]
            })
        else:
            self.research_summary.append({"source": "🎵 TikTok Shop", "count": 0, "status": "not_found", "highlights": []})

        if competitor_audits:
            self.research_summary.append({
                "source": "🔍 Website Audits",
                "count": len(competitor_audits),
                "status": "found",
                "highlights": [a.get("url", "")[:60] for a in competitor_audits]
            })
        else:
            self.research_summary.append({"source": "🔍 Website Audits", "count": 0, "status": "not_found", "highlights": []})

        # Slim data for LLM
        amazon_slim = self._extract_key_fields(amazon_results, ["title", "url", "content"], max_items=2)
        tiktok_slim = self._extract_key_fields(tiktok_shop_details, ["title", "price", "sold", "rating", "reviews"], max_items=2)

        competitor_context = self._prune_data({
            "amazon": amazon_slim, "tiktok": tiktok_slim, "audits": competitor_audits
        }, max_chars=120)

        system_prompt = (
            "You are a competitive intelligence analyst. Analyze competitor data and identify market gaps.\n\n"
            "You MUST return ONLY a JSON object with EXACTLY these 5 keys. No other keys allowed.\n\n"
            "EXACT SCHEMA (copy these field names EXACTLY):\n"
            '{"competitor_weaknesses":["weakness 1","weakness 2"],'
            '"pricing_gaps":["gap 1","gap 2"],'
            '"SEO_gaps":["seo gap 1","seo gap 2"],'
            '"product_opportunities":["opportunity 1","opportunity 2"],'
            '"market_saturation_score":45}\n\n'
            "RULES:\n"
            "- competitor_weaknesses: list of strings\n"
            "- pricing_gaps: list of strings\n"
            "- SEO_gaps: list of strings\n"
            "- product_opportunities: list of strings\n"
            "- market_saturation_score: integer 0-100\n"
            "- DO NOT add any extra keys like 'killer_advantage' or 'analysis'"
        )

        data_json = json.dumps(competitor_context, separators=(',', ':'))
        max_data_chars = MAX_PROMPT_CHARS - len(f"PRODUCT:{product_name}\nReturn JSON with exactly: competitor_weaknesses, pricing_gaps, SEO_gaps, product_opportunities, market_saturation_score.\nDATA:")
        if len(data_json) > max_data_chars:
            data_json = data_json[:max_data_chars]

        user_prompt = (
            f"PRODUCT:{product_name}\n"
            f"DATA:{data_json}\n"
            "Return JSON with exactly: competitor_weaknesses, pricing_gaps, SEO_gaps, product_opportunities, market_saturation_score."
        )

        output, provider = await call_with_fallback(
            "competitor_intelligence", system_prompt, user_prompt, CompetitorIntelligenceOutput, "system_run"
        )

        logger.info(f"Competitor Intel completed using {provider}")
        return output
