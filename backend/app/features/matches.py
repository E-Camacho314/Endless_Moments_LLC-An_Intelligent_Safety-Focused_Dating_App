from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from app.deps import get_current_user  # ✅ make sure this exists
from ..models import Interaction, Match

router = APIRouter(prefix="/matches", tags=["matches"])

class LikeReq(BaseModel):
    target_user_id: int  # ✅ matches frontend request

@router.post("/like")
def like(req: LikeReq, 
         db: Session = Depends(get_db),
         current_user: int = Depends(get_current_user)):
    """
    Like another user. Creates a match if mutual like exists.
    """

    actor_id = current_user.id
    target_id = req.target_user_id

    if actor_id == target_id:
        raise HTTPException(status_code=400, detail="You cannot like yourself.")

    # Store interaction
    db.add(Interaction(actor_id=actor_id, target_id=target_id, action="like"))

    # Check for mutual like
    mutual = db.query(Interaction).filter(
        Interaction.actor_id == target_id,
        Interaction.target_id == actor_id,
        Interaction.action == "like"
    ).first()

    match_obj = None
    if mutual:
        # Check if match already exists
        exists = db.query(Match).filter(
            ((Match.user_a == actor_id) & (Match.user_b == target_id)) |
            ((Match.user_a == target_id) & (Match.user_b == actor_id))
        ).first()
        if not exists:
            match_obj = Match(user_a=min(actor_id, target_id), user_b=max(actor_id, target_id))
            db.add(match_obj)

    db.commit()
    return {
        "ok": True,
        "matched": bool(mutual),
        "match_id": getattr(match_obj, "id", None)
    }

