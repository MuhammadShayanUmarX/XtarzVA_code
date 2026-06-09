from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
import uuid

from ..core.database import get_db
from ..core.auth import store_password, verify_password, create_access_token, get_current_user
from ..models.models import User, UserPreference, UsageCredit

router = APIRouter()

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

class AuthResponse(BaseModel):
    access_token: str
    refresh_token: str
    user: UserResponse

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
        hashed_password=stored_pwd,
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

    user_resp = UserResponse(
        id=str(new_user.id),
        email=new_user.email,
        name=new_user.name,
        plan=new_user.plan,
        is_onboarded=new_user.is_onboarded
    )

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_resp
    )

@router.post("/login", response_model=AuthResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    # 1. Fetch user by email
    query = select(User).where(User.email == data.email)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization failed. Credentials invalid."
        )

    # 2. Generate tokens
    access_token = create_access_token(subject=user.id)
    refresh_token = create_access_token(subject=user.id, expires_delta=timedelta(days=30))

    user_resp = UserResponse(
        id=str(user.id),
        email=user.email,
        name=user.name,
        plan=user.plan,
        is_onboarded=user.is_onboarded
    )

    return AuthResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_resp
    )

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token is missing or invalid."
        )
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        name=current_user.name,
        plan=current_user.plan,
        is_onboarded=current_user.is_onboarded
    )
