from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.schemas import NotificationCreate, NotificationRead
from . import crud_notifications


router = APIRouter(
    prefix="/notifications",
    tags=["notifications"]
)

@router.post("/", response_model=NotificationRead)
def create_notification(
    notification: NotificationCreate,
    db: Session = Depends(get_db)
):
    try:
        return crud_notifications.create_notification(db, notification)
    except Exception as e:
        #add error handling
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/user/{user_id}", response_model=List[NotificationRead])
def list_user_notifications(
    user_id: int,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    #Get notifications for a specific user
    return crud_notifications.get_notifications_by_user(db, user_id, skip, limit)

