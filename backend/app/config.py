import os
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Get the base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent

class Settings(BaseSettings):
    # App Settings
    BASE_URL: str = "http://localhost:8000"
    SECRET_KEY: str = "generate_a_secure_random_string"
    
    # Database Settings
    DATABASE_URL: str = "sqlite+aiosqlite:///./xtarzva.db"
    
    # Redis Settings
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    
    # Shopify Settings
    SHOPIFY_API_KEY: str = ""
    SHOPIFY_API_SECRET: str = ""
    
    # Groq LLM Settings
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    
    # Data & Research Settings
    TAVILY_API_KEY: str = ""
    APIFY_API_KEY: str = ""
    FIRECRAWL_API_KEY: str = ""
    SERP_API_KEY: str = ""
    SERPER_API_KEY: str = ""  # serper.dev — alternative to serpapi.com
    GEEKFLARE_API_KEY: str = ""
    CJ_DROPSHIPPING_API: str = ""

    # Visuals / Image Sourcing Settings (Unsplash)
    APPLICATION_AI: str = ""
    ACCESS_TOKEN: str = ""

    # Pydantic Settings configuration
    model_config = SettingsConfigDict(
        env_file=os.path.join(BASE_DIR, ".env"),
        env_file_encoding='utf-8',
        extra="ignore"
    )

settings = Settings()
