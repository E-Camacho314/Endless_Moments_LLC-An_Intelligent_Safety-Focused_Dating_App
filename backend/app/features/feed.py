# backend/app/features/feed.py

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from ..database import get_db
from ..deps import get_current_user
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
    return [
        ProfileOut(
            id=101, display_name="Ava", age=23,
            bio="Street food explorer. Indie films. Road trips.",
            badges=["ID Verified", "Video Verified"],
            circle="Austin Techies",
            photos=[PhotoOut(url="https://picsum.photos/seed/lyraA/800/1000")]
        ),
        ProfileOut(
            id=102, display_name="Maya", age=25,
            bio="Live music + climbing. Dog mom.",
            badges=["Event Attended"],
            circle="Dallas Musicians",
            photos=[PhotoOut(url="https://picsum.photos/seed/lyraB/800/1000")]
        ),
        ProfileOut(
            id=103, display_name="Lina", age=24,
            bio="Board games and iced matcha.",
            badges=[],
            circle="Campus Creators",
            photos=[PhotoOut(url="https://picsum.photos/seed/lyraC/800/1000")]
        ),
    ]

@router.get("/recommendations", response_model=List[ProfileOut])
def recommendations(
    limit: int = 20,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Feed recommendations for the logged-in user.
    Avoids repeat likes and filters out the current user.
    """

    try:
        # Get users not already liked/passed
        seen_ids = db.query(models.Interaction.target_id).filter(
            models.Interaction.actor_id == current_user.id
        )

        query = db.query(models.Profile).filter(
            models.Profile.user_id.not_in(seen_ids),
            models.Profile.user_id != current_user.id
        ).limit(limit)

        profiles = []
        for p in query:
            photos = []
            if hasattr(p, "photos") and p.photos:
                for ph in p.photos:
                    photos.append(PhotoOut(url=ph.url))
            else:
                photos = [PhotoOut(url=f"https://picsum.photos/seed/{p.user_id}/800/1000")]

            profiles.append(ProfileOut(
                id=p.user_id,
                display_name=p.display_name or "Mystery User",
                age=p.age,
                bio=p.bio,
                badges=(p.badges or []),
                circle=getattr(p, "circle", None),
                photos=photos
            ))

        if profiles:
            return profiles

    except Exception as e:
        print("⚠️ Feed DB lookup failed, using fallback:", e)

    return _fallback_profiles()

