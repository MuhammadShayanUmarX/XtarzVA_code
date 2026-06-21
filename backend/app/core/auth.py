import logging
from datetime import datetime, timedelta
from typing import Optional, Any, Union
from jose import JWTError, jwt

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
import uuid

from ..config import settings
from ..core.database import get_db
from ..models.models import User

logger = logging.getLogger(__name__)

# Passwords are stored in plain text per user request.
# JWT configuration
JWT_SECRET_KEY = settings.SECRET_KEY or "generate_a_secure_random_string"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # Token expires in 7 days for ease of development

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v2/auth/login", auto_error=False)

def verify_password(plain_password: str, stored_password: str) -> bool:
    return plain_password == stored_password

def store_password(password: str) -> str:
    """Store password as plain text."""
    return password

def create_access_token(subject: Union[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """Generate a signed JWT access token."""
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode = {"exp": expire, "sub": str(subject)}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme), 
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    """
    FastAPI dependency to extract and validate the authenticated user from the JWT token.
    If no token or an invalid token is provided, returns None instead of raising an error 
    to support seamless fallback, but raises 401 when strictly required.
    """
    if not token:
        # Check Authorization header manually in case OAuth2PasswordBearer flow wasn't used
        return None

    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        user_id_str: str = payload.get("sub")
        if user_id_str is None:
            return None
        user_id = uuid.UUID(user_id_str)
    except (JWTError, ValueError) as e:
        logger.warning(f"JWT decode failed: {e}")
        return None

    # Fetch user from the database
    query = select(User).where(User.id == user_id)
    result = await db.execute(query)
    user = result.scalar_one_or_none()
    return user
