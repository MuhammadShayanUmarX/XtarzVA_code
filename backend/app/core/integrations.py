from ..config import settings
from ..models.schemas import EngineStage

AGENT_INTEGRATIONS = {
    EngineStage.PRODUCT_INTELLIGENCE.value: {
        "llm": ["langchain", "gemini"],
        "research": ["tavily", "apify", "firecrawl", "serpapi"],
    },
    EngineStage.COMPETITOR_INTELLIGENCE.value: {
        "llm": ["langchain", "gemini"],
        "research": ["serpapi", "tavily", "apify", "firecrawl", "geekflare"],
    },
    EngineStage.PRODUCT_SOURCING.value: {
        "llm": ["langchain", "gemini"],
        "research": ["tavily", "firecrawl", "cj_dropshipping"],
    },
    EngineStage.META_ADS_SPY.value: {
        "llm": ["langchain", "gemini"],
        "research": ["serpapi", "tavily", "unsplash", "imagen"],
    },
    EngineStage.COMMERCE_CREATION.value: {
        "llm": ["langchain", "gemini"],
        "research": ["imagen", "unsplash"],
    },
}

INTEGRATION_ENV_MAP = {
    "langchain": "GOOGLE_API_KEY",
    "gemini": "GOOGLE_API_KEY",
    "imagen": "GOOGLE_API_KEY",
    "google": "GOOGLE_API_KEY",
    "tavily": "TAVILY_API_KEY",
    "apify": "APIFY_API_KEY",
    "firecrawl": "FIRECRAWL_API_KEY",
    "serpapi": "SERP_API_KEY",
    "geekflare": "GEEKFLARE_API_KEY",
    "cj_dropshipping": "CJ_DROPSHIPPING_API",
    "unsplash": ("ACCESS_TOKEN", "APPLICATION_AI"),
    "shopify": ("SHOPIFY_API_KEY", "SHOPIFY_API_SECRET"),
}


def _is_configured(name: str) -> bool:
    spec = INTEGRATION_ENV_MAP.get(name)
    if spec is None:
        return True
    if isinstance(spec, tuple):
        return all(bool(getattr(settings, key, "")) for key in spec)
    return bool(getattr(settings, spec, ""))


def get_integration_status() -> dict:
    configured = {name: _is_configured(name) for name in INTEGRATION_ENV_MAP}
    agents = {}
    for agent_id, groups in AGENT_INTEGRATIONS.items():
        agents[agent_id] = {
            "required_integrations": groups,
            "ready": all(
                _is_configured(name)
                for names in groups.values()
                for name in names
            ),
            "integrations": {
                name: _is_configured(name)
                for names in groups.values()
                for name in names
            },
        }
    return {"integrations": configured, "agents": agents}
