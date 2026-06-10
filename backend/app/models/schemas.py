from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
import uuid


class EngineStage(str, Enum):
    PRODUCT_INTELLIGENCE = "product_intelligence"
    COMPETITOR_INTELLIGENCE = "competitor_intelligence"
    PRODUCT_SOURCING = "product_sourcing"
    COMMERCE_CREATION = "commerce_creation"
    META_ADS_SPY = "meta_ads_spy"


class WorkflowState(BaseModel):
    status: str
    current_stage: str
    pending_approval: bool
    next_action: str
    user_controls_available: List[str] = ["pause", "resume", "stop", "approve"]
    engine_data: Dict[str, Any] = {}
    updated_at: datetime = Field(default_factory=datetime.now)


class ProductCandidate(BaseModel):
    product_name: str
    platform: str
    source_url: str = ""
    price: Optional[str] = None
    currency: str = "USD"
    demand_signal: Optional[str] = None
    category: Optional[str] = None
    snippet: Optional[str] = None
    is_recommended: bool = False


class CompetitorProfile(BaseModel):
    store_name: str
    store_url: str
    platform: str
    price: Optional[str] = None
    price_range: Optional[str] = None
    positioning: Optional[str] = None
    threat_level: Optional[str] = None
    is_shopify: bool = False
    notes: Optional[str] = None


class SourcingOption(BaseModel):
    supplier_name: str
    platform: str
    product_url: str = ""
    price_per_unit: Optional[float] = None
    moq: Optional[int] = None
    country: Optional[str] = None
    shipping_time: Optional[str] = None
    supplier_rating: Optional[float] = None
    is_recommended: bool = False


class ProductIntelligenceOutput(BaseModel):
    product_name: str
    product_category: str
    trend_score: int = Field(ge=0, le=100)
    demand_score: int = Field(ge=0, le=100)
    competition_score: int = Field(ge=0, le=100)
    estimated_margin: float
    risk_level: str
    evidence_sources: List[str] = []
    reasoning: str


class CompetitorIntelligenceOutput(BaseModel):
    competitor_weaknesses: List[str]
    pricing_gaps: List[str]
    SEO_gaps: List[str]
    product_opportunities: List[str]
    market_saturation_score: int = Field(ge=0, le=100)
    competitors: List[CompetitorProfile] = []


class TrackedAd(BaseModel):
    brand_name: str
    ad_copy: str
    media_type: str
    estimated_spend: float
    performance_score: int = Field(ge=0, le=100)
    hook_text: str
    ad_image_url: str = ""


class MetaAdsSpyOutput(BaseModel):
    top_competitors_tracked: List[str]
    active_ads: List[TrackedAd]
    winning_hooks: List[str]
    recommended_strategy: str


class SupplierInfo(BaseModel):
    supplier_name: str
    platform: str
    price_per_unit: float
    moq: int
    shipping_time: str
    supplier_rating: float
    product_url: str
    country: Optional[str] = None


class ProductSourcingOutput(BaseModel):
    suppliers: List[SupplierInfo]
    best_option: SupplierInfo
    profit_margin_estimate: float
    sourcing_risk_level: str
    reasoning: str


class ProductVariant(BaseModel):
    title: str = "Default"
    price: str = "29.99"
    compare_at_price: Optional[str] = None
    sku: str = ""


class CommerceCreationOutput(BaseModel):
    seo_titles: List[str]
    product_description: str
    bullet_benefits: List[str]
    tags: List[str]
    faqs: List[Dict[str, str]] = []
    ad_copy_hooks: List[str]
    ugc_scripts: List[str] = []
    image_generation_prompts: List[str] = []
    generated_image_urls: List[str] = []
    # Shopify-ready assets
    product_title: str = ""
    seo_meta_title: str = ""
    seo_meta_description: str = ""
    product_description_html: str = ""
    collection_title: str = ""
    collection_description: str = ""
    homepage_hero_headline: str = ""
    homepage_hero_subheadline: str = ""
    about_page_snippet: str = ""
    variants: List[ProductVariant] = []
    store_theme_json: Dict[str, Any] = {}


class SelectProductRequest(BaseModel):
    product: ProductIntelligenceOutput


class AgentRunRequest(BaseModel):
    initial_input: Dict[str, Any] = {}
    source_run_id: Optional[str] = None
    product: Optional[ProductIntelligenceOutput] = None


class StandaloneRunRequest(BaseModel):
    stage: EngineStage
    initial_input: Dict[str, Any] = {}
    source_run_id: Optional[str] = None
    product: Optional[ProductIntelligenceOutput] = None


class ImportProductRequest(BaseModel):
    source_run_id: str
    target_stage: EngineStage
    initial_input: Dict[str, Any] = {}
    product: Optional[ProductIntelligenceOutput] = None


class ContactSubmissionRequest(BaseModel):
    name: str
    email: str
    topic: str
    message: str


class ContactSubmissionResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: str
    topic: str
    message: str
    created_at: datetime
