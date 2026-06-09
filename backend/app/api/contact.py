from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
import uuid
import logging
from datetime import datetime

from ..models.models import ContactSubmission
from ..models.schemas import ContactSubmissionRequest, ContactSubmissionResponse
from ..core.database import get_db

router = APIRouter()
logger = logging.getLogger(__name__)

@router.post("/submit", response_model=ContactSubmissionResponse)
async def submit_contact_form(payload: ContactSubmissionRequest, db: AsyncSession = Depends(get_db)):
    """
    Submit a contact/enquiry query and store it in the database.
    """
    try:
        db_entry = ContactSubmission(
            id=uuid.uuid4(),
            name=payload.name.strip(),
            email=payload.email.strip().lower(),
            topic=payload.topic.strip(),
            message=payload.message.strip()
        )
        db.add(db_entry)
        await db.commit()
        await db.refresh(db_entry)
        
        logger.info(f"New contact submission from {db_entry.email} regarding '{db_entry.topic}'")
        return db_entry
    except Exception as e:
        logger.error(f"Error saving contact submission: {str(e)}")
        await db.rollback()
        raise HTTPException(status_code=500, detail="Database failure. Please try again.")
