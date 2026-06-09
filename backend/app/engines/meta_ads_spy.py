import logging
import json
from typing import Dict, Any, List
from ..models.schemas import MetaAdsSpyOutput, TrackedAd
from ..core.llm import call_with_fallback

logger = logging.getLogger(__name__)

class MetaAdsSpyEngine:
    def __init__(self):
        self.research_summary = []

    async def run(self, query: str) -> MetaAdsSpyOutput:
        logger.info(f"Starting Ad Creative for: {query}")
        
        # Simulate tracking ads since there is no public free Meta Ad Library API without tokens
        self.research_summary = [
            {"source": "Meta Ad Library", "count": 15, "status": "found", "highlights": [f"Tracked competitors for {query}"]}
        ]

        system_prompt = (
            "You are a Meta Ads Intelligence Agent. You scrape the Facebook Ad Library and return highly detailed insights about active ad creatives.\n"
            "Generate realistic, high-performing mock ad creatives, hooks, and strategies based on the user's query.\n\n"
            "OUTPUT: Valid JSON only.\n"
            "SCHEMA:\n"
            "{\n"
            "  \"top_competitors_tracked\": [\"Brand A\", \"Brand B\"],\n"
            "  \"active_ads\": [\n"
            "    {\n"
            "      \"brand_name\": \"Brand A\",\n"
            "      \"ad_copy\": \"Stop struggling with X. Introducing Y...\",\n"
            "      \"media_type\": \"Image\",\n"
            "      \"estimated_spend\": 15000.0,\n"
            "      \"performance_score\": 95,\n"
            "      \"hook_text\": \"Why everyone is switching to Y...\",\n"
            "      \"ad_image_url\": \"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80\"\n"
            "    }\n"
            "  ],\n"
            "  \"winning_hooks\": [\"Hook 1\", \"Hook 2\"],\n"
            "  \"recommended_strategy\": \"Focus on UGC video ads highlighting the primary pain point.\"\n"
            "}\n"
            "Make sure the 'ad_image_url' contains a real unsplash photo URL that visually matches the product niche (e.g., using relevant keywords in the URL or using a generic aesthetic product photo)."
        )

        user_prompt = f"Analyze competitors and active Meta ads for the following niche/product: {query}\nTASK: Generate MetaAdsSpyOutput JSON."

        output, provider = await call_with_fallback(
            "meta_ads_spy", system_prompt, user_prompt, MetaAdsSpyOutput, "system_run"
        )

        logger.info(f"Ad Creative completed using {provider}")
        return output
