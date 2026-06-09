from typing import Any, Dict

from ..models.schemas import EngineStage

# LangChain agent personas — one independent agent per UI section
AGENT_DEFINITIONS: Dict[str, Dict[str, Any]] = {
    EngineStage.PRODUCT_INTELLIGENCE.value: {
        "name": "Product Discovery Agent",
        "role": "Senior Product Research Analyst",
        "goal": "Find high-potential products using TikTok, Reddit, web, and URL signals.",
        "framework": "langchain",
    },
    EngineStage.COMPETITOR_INTELLIGENCE.value: {
        "name": "Competitor Intel Agent",
        "role": "Competitive Intelligence Analyst",
        "goal": "Expose competitor weaknesses, pricing gaps, and market saturation.",
        "framework": "langchain",
    },
    EngineStage.PRODUCT_SOURCING.value: {
        "name": "Sourcing Agent",
        "role": "Supply Chain Analyst",
        "goal": "Find margin-optimized suppliers on Alibaba, AliExpress, and CJ Dropshipping.",
        "framework": "langchain",
    },
    EngineStage.COMMERCE_CREATION.value: {
        "name": "Store Builder Agent",
        "role": "Commerce Content Specialist",
        "goal": "Generate SEO copy, ad hooks, and visual assets for store launch.",
        "framework": "langchain",
    },
    EngineStage.META_ADS_SPY.value: {
        "name": "Meta Ad Creative Agent",
        "role": "Performance Marketing Strategist",
        "goal": "Research competitor ads and produce scroll-stopping Meta creatives.",
        "framework": "langchain",
    },
}


def get_agent_definition(agent_id: str) -> Dict[str, Any]:
    return AGENT_DEFINITIONS.get(
        agent_id,
        {
            "name": agent_id.replace("_", " ").title(),
            "role": "Commerce Agent",
            "goal": "Complete the assigned research task.",
            "framework": "langchain",
        },
    )
