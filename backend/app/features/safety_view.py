from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import SafetyBadge

router = APIRouter(prefix="/safety", tags=["safety"])

@router.get("/badges/{user_id}")
def get_badges(user_id: int, db: Session = Depends(get_db)):
    b = db.query(SafetyBadge).filter(SafetyBadge.user_id==user_id).first()
    if not b:
        return {"user_id": user_id, "verified_id": False, "verified_video": False, "attended_event": False}
    return {
        "user_id": user_id,
        "verified_id": bool(b.verified_id),
        "verified_video": bool(b.verified_video),
        "attended_event": bool(b.attended_event)
    }
