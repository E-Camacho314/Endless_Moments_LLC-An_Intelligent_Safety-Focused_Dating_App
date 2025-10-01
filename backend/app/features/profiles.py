from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Profile

router = APIRouter(prefix="/profiles", tags=["profiles"])

@router.get("/me/{user_id}")
def get_me(user_id: int, db: Session = Depends(get_db)):
    p = db.query(Profile).filter(Profile.user_id==user_id).first()
    if not p:
        p = Profile(user_id=user_id); db.add(p); db.commit()
    return {"user_id": user_id, "city": p.city, "interests": p.interests, "photos": p.photos_json}

class UpdateReq(BaseModel):
    city: str | None = None
    interests: str | None = None

@router.put("/me/{user_id}")
def update_me(user_id: int, req: UpdateReq, db: Session = Depends(get_db)):
    p = db.query(Profile).filter(Profile.user_id==user_id).first()
    if not p:
        p = Profile(user_id=user_id)
        db.add(p)
    if req.city is not None: p.city = req.city
    if req.interests is not None: p.interests = req.interests
    db.commit()
    return {"ok": True}
