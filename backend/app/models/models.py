import uuid
from datetime import datetime
from typing import List, Optional, Dict
from sqlalchemy import String, Boolean, DateTime, Float, Integer, JSON, ForeignKey, Text, UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql import func


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    hashed_password: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    avatar_url: Mapped[Optional[str]] = mapped_column(String)
    plan: Mapped[str] = mapped_column(String, default="starter")
    is_onboarded: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    runs = relationship("Run", back_populates="user", cascade="all, delete-orphan")
    preferences = relationship("UserPreference", back_populates="user", uselist=False)


class Run(Base):
    __tablename__ = "runs"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    number: Mapped[int] = mapped_column(Integer, nullable=False)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, default="stopped")
    current_stage: Mapped[str] = mapped_column(String, default="")
    engine_data: Mapped[Dict] = mapped_column(JSON, default={})
    pending_approval: Mapped[bool] = mapped_column(Boolean, default=False)
    progress_pct: Mapped[float] = mapped_column(Float, default=0)
    credits_used: Mapped[int] = mapped_column(Integer, default=1)
    error: Mapped[Optional[str]] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="runs")


class UserPreference(Base):
    __tablename__ = "user_preferences"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    default_niches: Mapped[Optional[List[str]]] = mapped_column(JSON)
    default_sources: Mapped[Optional[List[str]]] = mapped_column(JSON)
    default_budget: Mapped[float] = mapped_column(Float, default=500)
    default_margin_target: Mapped[float] = mapped_column(Float, default=30)
    default_risk: Mapped[str] = mapped_column(String, default="balanced")
    kill_criteria_enabled: Mapped[bool] = mapped_column(Boolean, default=True)
    notification_prefs: Mapped[Dict] = mapped_column(JSON, default={})
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="preferences")


class UsageCredit(Base):
    __tablename__ = "usage_credits"

    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), primary_key=True)
    plan_credits: Mapped[int] = mapped_column(Integer, default=10)
    bonus_credits: Mapped[int] = mapped_column(Integer, default=0)
    used_credits: Mapped[int] = mapped_column(Integer, default=0)
    reset_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class StageIntelligenceData(Base):
    __tablename__ = "stage_product_intelligence"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    run_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("runs.id", ondelete="CASCADE"), nullable=False)
    product_name: Mapped[str] = mapped_column(String)
    product_category: Mapped[str] = mapped_column(String)
    trend_score: Mapped[int] = mapped_column(Integer)
    demand_score: Mapped[int] = mapped_column(Integer)
    competition_score: Mapped[int] = mapped_column(Integer)
    estimated_margin: Mapped[float] = mapped_column(Float)
    risk_level: Mapped[str] = mapped_column(String)
    reasoning: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class StageCompetitorData(Base):
    __tablename__ = "stage_competitor_intelligence"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    run_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("runs.id", ondelete="CASCADE"), nullable=False)
    market_saturation_score: Mapped[int] = mapped_column(Integer)
    weaknesses: Mapped[List[str]] = mapped_column(JSON)
    pricing_gaps: Mapped[List[str]] = mapped_column(JSON)
    seo_gaps: Mapped[List[str]] = mapped_column(JSON)
    opportunities: Mapped[List[str]] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class StageSourcingData(Base):
    __tablename__ = "stage_product_sourcing"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    run_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("runs.id", ondelete="CASCADE"), nullable=False)
    best_supplier_name: Mapped[str] = mapped_column(String)
    best_platform: Mapped[str] = mapped_column(String)
    best_price: Mapped[float] = mapped_column(Float)
    best_shipping: Mapped[str] = mapped_column(String)
    profit_margin_estimate: Mapped[float] = mapped_column(Float)
    risk_level: Mapped[str] = mapped_column(String)
    reasoning: Mapped[str] = mapped_column(Text)
    all_suppliers: Mapped[List[Dict]] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class StageCommerceData(Base):
    __tablename__ = "stage_commerce_creation"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    run_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("runs.id", ondelete="CASCADE"), nullable=False)
    seo_titles: Mapped[List[str]] = mapped_column(JSON)
    product_description: Mapped[str] = mapped_column(Text)
    bullet_benefits: Mapped[List[str]] = mapped_column(JSON)
    tags: Mapped[List[str]] = mapped_column(JSON)
    ad_copy_hooks: Mapped[List[str]] = mapped_column(JSON)
    image_urls: Mapped[List[str]] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class StageResearchSource(Base):
    __tablename__ = "stage_research_sources"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    run_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("runs.id", ondelete="CASCADE"), nullable=False)
    stage: Mapped[str] = mapped_column(String)
    source_type: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String)
    item_count: Mapped[int] = mapped_column(Integer, default=0)
    highlights: Mapped[List[str]] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class ContactSubmission(Base):
    __tablename__ = "contact_submissions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    email: Mapped[str] = mapped_column(String, nullable=False)
    topic: Mapped[str] = mapped_column(String, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
