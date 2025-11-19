from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Profile

router = APIRouter(prefix="/profiles", tags=["profiles"])

# Request model for updating user profile
class ProfileUpdate(BaseModel):
    display_name: str | None = None
    age: int | None = None
    gender: str | None = None
    bio: str | None = None
    photo_url: str | None = None
    occupation: str | None = None
    location: str | None = None
    pronouns: str | None = None
    preference: str | None = None
    interests: str | None = None
    relationship_goals: str | None = None
    member_since: str | None = None
    circle: str | None = None
    badges: str | None = None

# GET a profile by user_id
@router.get("/{user_id}")
def get_profile(user_id: int, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

# UPDATE a profile by user_id
@router.put("/{user_id}")
def update_profile(user_id: int, req: ProfileUpdate, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    for key, value in req.dict(exclude_unset=True).items():
        setattr(profile, key, value)

    db.commit()
    db.refresh(profile)
    return {"ok": True, "message": "Profile updated", "profile": profile}
