import logging
import json
from typing import Dict, Any
from ..models.schemas import CommerceCreationOutput, ProductIntelligenceOutput, CompetitorIntelligenceOutput, ProductSourcingOutput
from ..core.llm import call_with_fallback
from ..core.tools import research_tools

logger = logging.getLogger(__name__)

# Token budget for Groq free tier
MAX_PROMPT_CHARS = 3500


class CommerceCreationEngine:
    async def run(self, product_data: ProductIntelligenceOutput, competitor_data: CompetitorIntelligenceOutput, sourcing_data: ProductSourcingOutput) -> CommerceCreationOutput:
        """
        Generate complete product launch assets.
        Optimized for Groq Free Tier (6k TPM) — sends condensed strategic inputs.
        """
        logger.info(f"Starting Store Builder for: {product_data.product_name}")

        # Build a condensed summary of inputs instead of dumping full JSON
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

        # Condensed persona
        condensed_persona = (
            "You are a commerce content specialist. Turn product research into premium store listings and ad copy. "
            "Focus on: emotional copy, SEO-optimized titles, scroll-stopping hooks, and premium photorealistic image prompts."
        )

        system_prompt = (
            f"{condensed_persona}\n"
            "\nCRITICAL RULES FOR IMAGE PROMPTS:"
            "\n- Create extremely detailed, photorealistic, professional product photography prompts for Pollinations AI."
            "\n- Specify high-end photography details (e.g., 'studio lighting', 'minimalist aesthetic', 'shot on 85mm lens', 'hyper-realistic', 'sharp focus', 'soft shadows', 'commercial catalog style')."
            "\n- Focus on the main product and its key benefits. Do NOT include human faces to ensure clean product rendering."
            "\n\nRETURN ONLY valid JSON matching this schema:"
            "\n{"
            "\n  \"seo_titles\": [\"3 SEO-optimized titles\"],"
            "\n  \"product_description\": \"Compelling product description\","
            "\n  \"bullet_benefits\": [\"5 key benefits\"],"
            "\n  \"tags\": [\"relevant tags\"],"
            "\n  \"faqs\": [{\"question\":\"\",\"answer\":\"\"}],"
            "\n  \"ad_copy_hooks\": [\"3 scroll-stopping hooks\"],"
            "\n  \"ugc_scripts\": [\"2 short UGC video scripts\"],"
            "\n  \"image_generation_prompts\": [\"2 detailed, high-fidelity photorealistic image prompts\"]"
            "\n}"
        )

        user_prompt = (
            f"INPUTS:\n"
            f"- {product_summary}\n"
            f"- {competitor_summary}\n"
            f"- {sourcing_summary}\n\n"
            "TASK: Create a cohesive, premium brand presence. Return JSON."
        )

        # Safety truncation
        if len(user_prompt) > MAX_PROMPT_CHARS:
            logger.warning(f"Commerce creation prompt ({len(user_prompt)} chars) exceeds budget. Truncating.")
            user_prompt = user_prompt[:MAX_PROMPT_CHARS]

        logger.info(f"Store Builder prompt size: system={len(system_prompt)} user={len(user_prompt)} chars")

        output, provider = await call_with_fallback(
            "commerce_creation",
            system_prompt,
            user_prompt,
            CommerceCreationOutput,
            "system_run"
        )

        # --- IMAGE GENERATION ---
        # Generate real URLs for the prompts using Pollinations AI
        if output.image_generation_prompts:
            logger.info(f"Generating {len(output.image_generation_prompts)} product images")
            output.generated_image_urls = [
                research_tools.generate_image_url(prompt)
                for prompt in output.image_generation_prompts
            ]

        # --- UNSPLASH INTEGRATION ---
        # Search Unsplash for high-quality royalty-free stock photos matching the product name
        try:
            unsplash_query = product_data.product_name
            logger.info(f"Searching Unsplash for: {unsplash_query}")
            unsplash_urls = await research_tools.search_unsplash_photos(unsplash_query, max_items=2)
            if unsplash_urls:
                logger.info(f"Successfully retrieved {len(unsplash_urls)} stock photos from Unsplash")
                output.generated_image_urls.extend(unsplash_urls)
            else:
                logger.info("No Unsplash stock photos found or Unsplash is not configured.")
        except Exception as e:
            logger.error(f"Failed to fetch Unsplash stock photos: {str(e)}")

        logger.info(f"Store Builder completed using {provider}")
        return output
