from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid
import logging

from ..core.database import get_db
from ..core.auth import get_current_user
from ..models.models import FeedbackSubmission, User
from ..models.schemas import FeedbackSubmissionRequest, FeedbackSubmissionResponse

router = APIRouter()
logger = logging.getLogger(__name__)


def _require_user(current_user: User | None) -> User:
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required.",
        )
    return current_user


@router.post("/feedback", response_model=FeedbackSubmissionResponse)
async def submit_feedback(
    payload: FeedbackSubmissionRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    user = _require_user(current_user)

    try:
        entry = FeedbackSubmission(
            id=uuid.uuid4(),
            user_id=user.id,
            category=payload.category.strip(),
            rating=payload.rating,
            message=payload.message.strip(),
            page_context=(payload.page_context or "").strip() or None,
        )
        db.add(entry)
        await db.commit()
        await db.refresh(entry)
        logger.info("Feedback from user %s — category=%s", user.email, entry.category)
        return entry
    except Exception as e:
        logger.error("Error saving feedback: %s", e)
        await db.rollback()
        raise HTTPException(status_code=500, detail="Could not save feedback. Please try again.")


@router.get("/feedback", response_model=list[FeedbackSubmissionResponse])
async def list_feedback(
    db: AsyncSession = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    user = _require_user(current_user)

    result = await db.execute(
        select(FeedbackSubmission)
        .where(FeedbackSubmission.user_id == user.id)
        .order_by(FeedbackSubmission.created_at.desc())
        .limit(50)
    )
    return result.scalars().all()
