from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import User  # adjust based on your model name

router = APIRouter(prefix="/profiles", tags=["profiles"])

# Request model for updating user profile
class ProfileUpdate(BaseModel):
    name: str | None = None
    age: int | None = None
    gender: str | None = None
    bio: str | None = None
    profile_picture: str | None = None

@router.put("/{user_id}")
def update_profile(user_id: int, req: ProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in req.dict(exclude_unset=True).items():
        setattr(user, key, value)
    db.commit()
    db.refresh(user)
    return {"ok": True, "message": "Profile updated", "user": user}
