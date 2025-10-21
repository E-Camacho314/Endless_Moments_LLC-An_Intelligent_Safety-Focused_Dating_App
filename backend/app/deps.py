# backend/app/deps.py

from fastapi import Depends, HTTPException, Header
from sqlalchemy.orm import Session
from .database import get_db
from .models import User

def get_current_user(
    db: Session = Depends(get_db),
    x_user_id: int = Header(default=1)  # temporary fallback user
):
    """
    Temporary simple user auth.
    Will be replaced with JWT session later.
    """
    user = db.query(User).filter(User.id == x_user_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

