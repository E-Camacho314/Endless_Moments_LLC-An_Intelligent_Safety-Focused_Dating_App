from sqlalchemy.orm import Session
from app.models import Notification
from app.schemas import NotificationCreate

def create_notification(db: Session, notification: NotificationCreate):
    db_notification = Notification(
        user_id=notification.user_id,
        type=notification.type,
        content=notification.content,
    )
    db.add(db_notification)
    db.commit()
    db.refresh(db_notification)
    return db_notification

def get_notification(db: Session, notification_id: int):
    return db.query(Notification).filter(Notification.id == notification_id).first()

def get_notifications_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 10):
    return (
        db.query(Notification)
        .filter(Notification.user_id == user_id)
        .order_by(Notification.timestamp.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

def update_notification_read(db: Session, notification_id: int, is_read: bool = True):
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if notif:
        notif.is_read = is_read
        db.commit()
        db.refresh(notif)
    return notif

def delete_notification(db: Session, notification_id: int):
    notif = db.query(Notification).filter(Notification.id == notification_id).first()
    if notif:
        db.delete(notif)
        db.commit()
    return notif
