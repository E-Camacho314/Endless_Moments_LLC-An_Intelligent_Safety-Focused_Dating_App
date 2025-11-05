# backend/app/features/feed.py

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_db
from .. import models

router = APIRouter(prefix="/feed", tags=["feed"])

class PhotoOut(BaseModel):
    url: str

class ProfileOut(BaseModel):
    id: int
    display_name: str
    age: Optional[int] = None
    bio: Optional[str] = None
    badges: List[str] = []
    circle: Optional[str] = None
    photos: List[PhotoOut] = []

def _fallback_profiles() -> List[ProfileOut]:
    # larger fallback set for testing and smoother discovery when DB is empty
    seeds = [
        (201, "Ava", 23, "Street food explorer. Indie films. Road trips.", ["ID Verified", "Video Verified"], "Austin Techies"),
        (202, "Maya", 25, "Live music + climbing. Dog mom.", ["Event Attended"], "Dallas Musicians"),
        (203, "Lina", 24, "Board games and iced matcha.", [], "Campus Creators"),
    ]
    out: List[ProfileOut] = []
    for sid, name, age, bio, badges, circle in seeds:
        out.append(ProfileOut(id=sid, display_name=name, age=age, bio=bio, badges=badges, circle=circle,
                              photos=[PhotoOut(url=f"https://picsum.photos/seed/lyra{sid}/800/1000")] ))
    return out

@router.get("/recommendations", response_model=List[ProfileOut])
def recommendations(
    limit: int = Query(20, ge=1, le=50),
    current_user_id: Optional[int] = Query(None, description="Optional actor user id to filter seen profiles"),
    db: Session = Depends(get_db),
):
    """
    Feed recommendations for the logged-in user.
    Avoids repeat likes and filters out the current user.
    """

    try:
        # Build query and exclude already-seen targets and the current user
        q = db.query(models.Profile)

        if current_user_id is not None:
            seen_rows = db.query(models.Interaction.target_id).filter(
                models.Interaction.actor_id == current_user_id
            ).all()
            seen_ids = [r[0] for r in seen_rows] if seen_rows else []
            if seen_ids:
                q = q.filter(~models.Profile.user_id.in_(seen_ids))
            q = q.filter(models.Profile.user_id != current_user_id)

        # simple discovery: randomize ordering for variety, limit results for performance
        q = q.order_by(func.random()).limit(limit)

        profiles: List[ProfileOut] = []
        for p in q.all():
            # photos: prefer single photo_url, otherwise fallback
            photos: List[PhotoOut] = []
            photo_url = getattr(p, 'photo_url', None)
            if photo_url:
                photos = [PhotoOut(url=str(photo_url))]
            else:
                photos = [PhotoOut(url=f"https://picsum.photos/seed/{getattr(p,'user_id', getattr(p,'id', 'anon'))}/800/1000")]

            # badges normalization (support comma-separated strings)
            raw_badges = getattr(p, 'badges', None)
            badges_list: List[str] = []
            if raw_badges:
                if isinstance(raw_badges, (list, tuple)):
                    badges_list = list(raw_badges)
                else:
                    badges_list = [b.strip() for b in str(raw_badges).split(',') if b.strip()]

            profiles.append(ProfileOut(
                id=int(getattr(p, 'user_id', getattr(p, 'id', 0))),
                display_name=str(getattr(p, 'display_name', 'Mystery User')),
                age=getattr(p, 'age', None),
                bio=getattr(p, 'bio', None),
                badges=badges_list,
                circle=getattr(p, 'circle', None),
                photos=photos
            ))

        if profiles:
            return profiles

    except Exception as e:
        print("⚠️ Feed DB lookup failed, using fallback:", e)

    return _fallback_profiles()

