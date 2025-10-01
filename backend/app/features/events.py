from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Event, Circle

router = APIRouter(prefix="/events", tags=["events"])

@router.get("")
def list_events(db: Session = Depends(get_db)):
    events = db.query(Event).all()
    out = []
    for e in events:
        circle = db.query(Circle).filter(Circle.id==e.circle_id).first()
        out.append({
            "id": e.id, "title": e.title, "starts_at": e.starts_at.isoformat(),
            "location": e.location, "circle": circle.slug if circle else None
        })
    return {"events": out}
