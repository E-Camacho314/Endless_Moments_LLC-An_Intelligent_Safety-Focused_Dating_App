from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional

from app.database import get_db
from app.model import Profile, Swipe, Match

router = APIRouter(prefix="/discovery", tags=["discovery"])

class SwipeRequest(BaseModel):
    swiper_id: int
    swipee_id: int
    direction: str  # 'left' or 'right'

class FilterRequest(BaseModel):
    age_min: int = 18
    age_max: int = 100
    city: Optional[str] | None

@router.post("/swipe/{user_id}")
def swipe(user_id: int, swipe: SwipeRequest, db: Session = Depends(get_db)):
    if swipe.direction not in ['left', 'right']:
        raise HTTPException(status_code=400, detail="Invalid swipe direction")

    new_swipe = Swipe(
        swiper_id=swipe.swiper_id,
        swipee_id=swipe.swipee_id,
        direction=swipe.direction,
        timestamp=datetime.utcnow()
    )
    db.add(new_swipe)
    db.commit()

    if swipe.direction == 'right':
        existing_swipe = db.query(Swipe).filter(
            Swipe.swiper_id == swipe.swipee_id,
            Swipe.swipee_id == swipe.swiper_id,
            Swipe.direction == 'right'
        ).first()
        if existing_swipe:
            new_match = Match(
                profile1_id=swipe.swiper_id,
                profile2_id=swipe.swipee_id,
                timestamp=datetime.utcnow()
            )
            db.add(new_match)
            db.commit()
            return {"message": "It's a match!"}

    return {"message": "Swipe recorded"}

@router.post("/feed/{user_id}")
def get_discovery_feed(user_id: int, filters: FilterRequest, db: Session = Depends(get_db)):
    query = db.query(Profile).filter(Profile.user_id != user_id)

    if filters.age_min is not None:
        query = query.filter(Profile.age >= filters.age_min)
    if filters.age_max is not None:
        query = query.filter(Profile.age <= filters.age_max)
    if filters.city:
        query = query.filter(Profile.city == filters.city)

    from sqlalchemy import select

    swiped_ids_subquery = select(Swipe.swipee_id).where(Swipe.swiper_id == user_id)
    query = query.filter(~Profile.user_id.in_(swiped_ids_subquery))

    profiles = query.all()
    return [
        {
            "user_id": profile.user_id,
            "city": profile.city,
            "age": profile.age,
            "photos_json": profile.photos_json,
            "bio": profile.bio

        }
        for profile in profiles
    ]

@router.get("/suggested/{user_id}")
def get_suggested_profiles(user_id: int, db: Session = Depends(get_db)):
    user_profile = db.query(Profile).filter(Profile.user_id == user_id).first()
    if not user_profile:
        raise HTTPException(status_code=404, detail="User profile not found")

    query = db.query(Profile).filter(
        Profile.user_id != user_id,
        Profile.city == user_profile.city,
        Profile.age.between(user_profile.age - 5, user_profile.age + 5)
    )

    from sqlalchemy import select

    swiped_ids_subquery = select(Swipe.swipee_id).where(Swipe.swiper_id == user_id)
    query = query.filter(~Profile.user_id.in_(swiped_ids_subquery))

    suggested_profiles = query.all()
    return [
        {
            "user_id": profile.user_id,
            "city": profile.city,
            "age": profile.age,
            "photos_json": profile.photos_json,
            "bio": profile.bio

        }
        for profile in suggested_profiles
    ]