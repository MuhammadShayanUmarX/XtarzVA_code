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
    # Product marketing pack (moved from Store Builder)
    seo_titles: List[str] = []
    seo_meta_title: str = ""
    seo_meta_description: str = ""
    product_title: str = ""
    product_creative_description: str = ""
    product_creative_description_html: str = ""
    bullet_benefits: List[str] = []
    tags: List[str] = []
    faqs: List[Dict[str, str]] = []
    ad_copy_hooks: List[str] = []
    ugc_scripts: List[str] = []
    creative_image_prompts: List[str] = []
    creative_image_urls: List[str] = []


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
    theme_name: str = "XtarzVA Store"
    theme_slug: str = "xtarz-store"
    design_direction: str = ""
    settings_data: Dict[str, Any] = {}
    homepage_sections: Dict[str, Any] = {}
    theme_colors: Dict[str, str] = {}
    hero_headline: str = ""
    hero_subheadline: str = ""
    hero_button_label: str = "Shop the collection"
    about_snippet: str = ""
    collection_title: str = ""
    collection_description: str = ""
    trust_heading: str = ""
    trust_points: List[str] = []
    testimonial_quote: str = ""
    testimonial_author: str = ""
    image_generation_prompts: List[str] = []
    hero_image_urls: List[str] = []
    product_image_urls: List[str] = []
    hero_image_assets: List[str] = []
    product_image_assets: List[str] = []
    theme_image_payloads: Dict[str, str] = {}
    product_handle: str = ""
    collection_handle: str = ""
    variants: List[ProductVariant] = []


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


class AdSpyOutput(BaseModel):
    competitors_tracked: List[str] = []
    active_ads: List[TrackedAd] = []
    winning_hooks: List[str] = []
    recommended_strategy: str = ""


class FeedbackSubmissionRequest(BaseModel):
    category: str = Field(..., min_length=1, max_length=64)
    message: str = Field(..., min_length=3, max_length=5000)
    rating: Optional[int] = Field(default=None, ge=1, le=5)
    page_context: Optional[str] = Field(default=None, max_length=128)


class FeedbackSubmissionResponse(BaseModel):
    id: uuid.UUID
    category: str
    rating: Optional[int]
    message: str
    page_context: Optional[str]
    created_at: datetime


class AdSpyRunRequest(BaseModel):
    query: str = Field(..., min_length=2, max_length=256)
    brand_filter: Optional[str] = Field(default=None, max_length=128)
    platform: str = Field(default="facebook", max_length=32)


class AdSpySessionResponse(BaseModel):
    id: uuid.UUID
    query: str
    brand_filter: Optional[str]
    platform: str
    status: str
    competitors_tracked: List[str]
    active_ads: List[TrackedAd]
    winning_hooks: List[str]
    recommended_strategy: Optional[str]
    created_at: datetime
