from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Interaction, Match

router = APIRouter(prefix="/matches", tags=["matches"])

class LikeReq(BaseModel):
    actor_id: int
    target_id: int

@router.post("/like")
def like(req: LikeReq, db: Session = Depends(get_db)):
    db.add(Interaction(actor_id=req.actor_id, target_id=req.target_id, action="like"))
    # Mutual like?
    mutual = db.query(Interaction).filter(
        Interaction.actor_id==req.target_id,
        Interaction.target_id==req.actor_id,
        Interaction.action=="like"
    ).first()
    match_obj = None
    if mutual:
        # create match if not exists
        exists = db.query(Match).filter(
            ((Match.user_a==req.actor_id) & (Match.user_b==req.target_id)) |
            ((Match.user_a==req.target_id) & (Match.user_b==req.actor_id))
        ).first()
        if not exists:
            match_obj = Match(user_a=min(req.actor_id, req.target_id), user_b=max(req.actor_id, req.target_id))
            db.add(match_obj)
    db.commit()
    return {"ok": True, "matched": bool(match_obj), "match_id": getattr(match_obj, "id", None)}
