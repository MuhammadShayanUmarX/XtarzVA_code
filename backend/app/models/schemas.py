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


class ProductSourcingOutput(BaseModel):
    suppliers: List[SupplierInfo]
    best_option: SupplierInfo
    profit_margin_estimate: float
    sourcing_risk_level: str
    reasoning: str


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
