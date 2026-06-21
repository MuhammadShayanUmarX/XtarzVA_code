from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta
import uuid

from ..core.database import get_db
from ..core.auth import store_password, verify_password, create_access_token, get_current_user
from ..models.models import User, UserPreference, UsageCredit, Run

router = APIRouter()

PLAN_LABELS = {
    "starter": "Starter",
    "growth": "Growth",
    "agency": "Agency",
}

PLAN_PRICES = {
    "starter": 49.0,
    "growth": 99.0,
    "agency": 299.0,
}

# --- Schemas ---
class SignUpRequest(BaseModel):
    fullName: str
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=72)
    shopifyUrl: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., max_length=72)

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    plan: str
    is_onboarded: bool
    avatar_url: Optional[str] = None

class ProfileUpdateRequest(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=120)
    avatar_url: Optional[str] = Field(None, max_length=500)

class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., max_length=72)
    new_password: str = Field(..., min_length=8, max_length=72)

class PreferencesResponse(BaseModel):
    default_niches: Optional[List[str]] = None
    default_sources: Optional[List[str]] = None
    default_budget: float = 500.0
    default_margin_target: float = 30.0
    default_risk: str = "balanced"
    kill_criteria_enabled: bool = True
    notification_prefs: Dict[str, Any] = {}

class PreferencesUpdateRequest(BaseModel):
    default_niches: Optional[List[str]] = None
    default_sources: Optional[List[str]] = None
    default_budget: Optional[float] = None
    default_margin_target: Optional[float] = None
    default_risk: Optional[str] = None
    kill_criteria_enabled: Optional[bool] = None
    notification_prefs: Optional[Dict[str, Any]] = None

class BillingResponse(BaseModel):
    plan: str
    plan_label: str
    plan_price: float
    plan_credits: int
    bonus_credits: int
    used_credits: int
    remaining_credits: int
    reset_at: datetime

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserResponse

def _user_response(user: User) -> UserResponse:
    return UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        plan=user.plan,
        is_onboarded=user.is_onboarded,
        avatar_url=user.avatar_url,
    )


async def _get_or_create_preferences(db: AsyncSession, user_id: uuid.UUID) -> UserPreference:
    result = await db.execute(select(UserPreference).where(UserPreference.user_id == user_id))
    prefs = result.scalar_one_or_none()
    if prefs:
        return prefs
    prefs = UserPreference(user_id=user_id, notification_prefs={})
    db.add(prefs)
    await db.commit()
    await db.refresh(prefs)
    return prefs


async def _get_or_create_credits(db: AsyncSession, user_id: uuid.UUID) -> UsageCredit:
    result = await db.execute(select(UsageCredit).where(UsageCredit.user_id == user_id))
    credits = result.scalar_one_or_none()
    if credits:
        return credits
    credits = UsageCredit(
        user_id=user_id,
        plan_credits=10,
        bonus_credits=0,
        used_credits=0,
        reset_at=datetime.utcnow() + timedelta(days=30),
    )
    db.add(credits)
    await db.commit()
    await db.refresh(credits)
    return credits


# --- Endpoints ---

@router.post("/signup", response_model=AuthResponse)
async def signup(data: SignUpRequest, db: AsyncSession = Depends(get_db)):
    # 1. Check if user already exists
    query = select(User).where(User.email == data.email)
    result = await db.execute(query)
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email address already exists."
        )

    # 2. Store password (plain text for now — hash in production later)
    stored_pwd = store_password(data.password)
    user_id = uuid.uuid4()
    
    new_user = User(
        id=user_id,
        email=data.email,
        name=data.fullName,
        password=stored_pwd,
        plan="starter",
        is_onboarded=False
    )
    db.add(new_user)

    # 3. Create starter preferences and credits
    new_prefs = UserPreference(
        user_id=user_id,
        default_niches=["beauty", "wellness", "fitness"],
        default_sources=["CJ Dropshipping", "Alibaba"],
        default_budget=500.0,
        default_margin_target=30.0,
        default_risk="balanced",
        kill_criteria_enabled=True,
        notification_prefs={}
    )
    db.add(new_prefs)

    new_credits = UsageCredit(
        user_id=user_id,
        plan_credits=10,
        bonus_credits=0,
        used_credits=0,
        reset_at=datetime.utcnow() + timedelta(days=30)
    )
    db.add(new_credits)

    await db.commit()
    await db.refresh(new_user)

    # 4. Generate tokens
    access_token = create_access_token(subject=new_user.id)
    refresh_token = create_access_token(subject=new_user.id, expires_delta=timedelta(days=30))

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=_user_response(new_user),
    )

@router.post("/login", response_model=AuthResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    # 1. Fetch user by email
    query = select(User).where(User.email == data.email)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(data.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization failed. Credentials invalid."
        )

    # 2. Generate tokens
    access_token = create_access_token(subject=user.id)
    refresh_token = create_access_token(subject=user.id, expires_delta=timedelta(days=30))

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=_user_response(user),
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing or invalid."
        )
    return _user_response(current_user)


@router.patch("/me", response_model=UserResponse)
async def update_me(
    data: ProfileUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated.")
    if data.name is not None:
        current_user.name = data.name.strip()
    if data.avatar_url is not None:
        current_user.avatar_url = data.avatar_url.strip() or None
    await db.commit()
    await db.refresh(current_user)
    return _user_response(current_user)


@router.post("/change-password")
async def change_password(
    data: ChangePasswordRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated.")
    if not verify_password(data.current_password, current_user.password or ""):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect.")
    current_user.password = store_password(data.new_password)
    await db.commit()
    return {"status": "ok", "message": "Password updated successfully."}


@router.get("/billing", response_model=BillingResponse)
async def get_billing(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated.")
    credits = await _get_or_create_credits(db, current_user.id)
    plan = current_user.plan or "starter"
    remaining = max(0, credits.plan_credits + credits.bonus_credits - credits.used_credits)
    return BillingResponse(
        plan=plan,
        plan_label=PLAN_LABELS.get(plan, plan.title()),
        plan_price=PLAN_PRICES.get(plan, 0.0),
        plan_credits=credits.plan_credits,
        bonus_credits=credits.bonus_credits,
        used_credits=credits.used_credits,
        remaining_credits=remaining,
        reset_at=credits.reset_at,
    )


@router.get("/preferences", response_model=PreferencesResponse)
async def get_preferences(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated.")
    prefs = await _get_or_create_preferences(db, current_user.id)
    return PreferencesResponse(
        default_niches=prefs.default_niches,
        default_sources=prefs.default_sources,
        default_budget=prefs.default_budget,
        default_margin_target=prefs.default_margin_target,
        default_risk=prefs.default_risk,
        kill_criteria_enabled=prefs.kill_criteria_enabled,
        notification_prefs=prefs.notification_prefs or {},
    )


@router.patch("/preferences", response_model=PreferencesResponse)
async def update_preferences(
    data: PreferencesUpdateRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated.")
    prefs = await _get_or_create_preferences(db, current_user.id)
    if data.default_niches is not None:
        prefs.default_niches = data.default_niches
    if data.default_sources is not None:
        prefs.default_sources = data.default_sources
    if data.default_budget is not None:
        prefs.default_budget = data.default_budget
    if data.default_margin_target is not None:
        prefs.default_margin_target = data.default_margin_target
    if data.default_risk is not None:
        prefs.default_risk = data.default_risk
    if data.kill_criteria_enabled is not None:
        prefs.kill_criteria_enabled = data.kill_criteria_enabled
    if data.notification_prefs is not None:
        prefs.notification_prefs = data.notification_prefs
    await db.commit()
    await db.refresh(prefs)
    return PreferencesResponse(
        default_niches=prefs.default_niches,
        default_sources=prefs.default_sources,
        default_budget=prefs.default_budget,
        default_margin_target=prefs.default_margin_target,
        default_risk=prefs.default_risk,
        kill_criteria_enabled=prefs.kill_criteria_enabled,
        notification_prefs=prefs.notification_prefs or {},
    )


@router.delete("/me")
async def delete_account(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not current_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated.")
    await db.execute(delete(Run).where(Run.user_id == current_user.id))
    await db.delete(current_user)
    await db.commit()
    return {"status": "ok", "message": "Account deleted."}
