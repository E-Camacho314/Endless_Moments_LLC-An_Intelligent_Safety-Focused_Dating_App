from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Report, ModerationAction

router = APIRouter(prefix="/reports", tags=["reports"])

class CreateReportReq(BaseModel):
    reporter_id: int
    target_user_id: int
    reason: str
    details: str = ""

@router.post("")
def create_report(req: CreateReportReq, db: Session = Depends(get_db)):
    r = Report(**req.dict())
    db.add(r); db.commit()
    return {"ok": True, "report_id": r.id}

@router.get("/queue")
def queue(db: Session = Depends(get_db)):
    items = db.query(Report).order_by(Report.created_at.desc()).limit(100).all()
    return {"items": [{
        "id": r.id, "reporter_id": r.reporter_id, "target_user_id": r.target_user_id,
        "reason": r.reason, "details": r.details, "created_at": r.created_at.isoformat()
    } for r in items]}

class ActionReq(BaseModel):
    target_user_id: int
    action: str
    moderator_id: int
    notes: str = ""

@router.post("/action")
def action(req: ActionReq, db: Session = Depends(get_db)):
    a = ModerationAction(**req.dict())
    db.add(a); db.commit()
    return {"ok": True, "action_id": a.id}
