from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
import logging

from ..core.database import get_db
from ..core.auth import get_current_user
from ..engines.ad_spy import AdSpyEngine
from ..models.models import AdSpySession, User
from ..models.schemas import AdSpyRunRequest, AdSpySessionResponse, TrackedAd

router = APIRouter()
logger = logging.getLogger(__name__)


def _require_user(current_user: User | None) -> User:
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
        )
    return current_user


def _serialize_session(session: AdSpySession) -> AdSpySessionResponse:
    ads = [TrackedAd.model_validate(a) for a in (session.active_ads or [])]
    return AdSpySessionResponse(
        id=session.id,
        query=session.query,
        brand_filter=session.brand_filter,
        platform=session.platform,
        status=session.status,
        competitors_tracked=session.competitors_tracked or [],
        active_ads=ads,
        winning_hooks=session.winning_hooks or [],
        recommended_strategy=session.recommended_strategy,
        created_at=session.created_at,
    )


@router.post("/run", response_model=AdSpySessionResponse)
async def run_ad_spy(
    payload: AdSpyRunRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    user = _require_user(current_user)
    engine = AdSpyEngine()

    try:
        output, raw_research = await engine.run(
            query=payload.query.strip(),
            brand_filter=(payload.brand_filter or "").strip() or None,
            platform=payload.platform.strip().lower() or "facebook",
        )

        session = AdSpySession(
            id=uuid.uuid4(),
            user_id=user.id,
            query=payload.query.strip(),
            brand_filter=(payload.brand_filter or "").strip() or None,
            platform=payload.platform.strip().lower() or "facebook",
            status="completed",
            competitors_tracked=output.competitors_tracked,
            active_ads=[ad.model_dump() for ad in output.active_ads],
            winning_hooks=output.winning_hooks,
            recommended_strategy=output.recommended_strategy,
            raw_research=raw_research,
        )
        db.add(session)
        await db.commit()
        await db.refresh(session)
        return _serialize_session(session)
    except Exception as e:
        logger.error("Ad spy failed: %s", e, exc_info=True)
        await db.rollback()
        raise HTTPException(status_code=500, detail="Ad spy failed. Please try again.")


@router.get("/sessions", response_model=list[AdSpySessionResponse])
async def list_ad_spy_sessions(
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    user = _require_user(current_user)

    result = await db.execute(
        select(AdSpySession)
        .where(AdSpySession.user_id == user.id)
        .order_by(AdSpySession.created_at.desc())
        .limit(50)
    )
    return [_serialize_session(s) for s in result.scalars().all()]


@router.get("/sessions/{session_id}", response_model=AdSpySessionResponse)
async def get_ad_spy_session(
    session_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    user = _require_user(current_user)

    result = await db.execute(
        select(AdSpySession).where(
            AdSpySession.id == session_id,
            AdSpySession.user_id == user.id,
        )
    )
    session = result.scalar_one_or_none()
    if not session:
        raise HTTPException(status_code=404, detail="Ad spy session not found.")
    return _serialize_session(session)
