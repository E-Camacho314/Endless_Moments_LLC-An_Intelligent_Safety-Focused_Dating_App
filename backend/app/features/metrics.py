from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import DailyMetrics
from datetime import datetime, timedelta

router = APIRouter(prefix="/metrics", tags=["metrics"])

@router.get("/summary")
def summary(days: int = 7, db: Session = Depends(get_db)):
    # ensure rows exist
    today = datetime.utcnow().date()
    for i in range(days):
        day = (today - timedelta(days=i)).isoformat()
        row = db.query(DailyMetrics).filter(DailyMetrics.day==day).first()
        if not row:
            row = DailyMetrics(day=day, new_users=10+i, likes=50+i*3, matches=12+i, messages=80+i*5)
            db.add(row)
    db.commit()

    rows = db.query(DailyMetrics).order_by(DailyMetrics.day.asc()).all()
    return {"series": [{"day": r.day, "new_users": r.new_users, "likes": r.likes, "matches": r.matches, "messages": r.messages} for r in rows[-days:]]}
