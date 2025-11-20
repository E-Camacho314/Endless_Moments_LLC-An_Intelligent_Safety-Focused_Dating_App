from pydantic import BaseModel
from datetime import datetime

class NotificationCreate(BaseModel):
    user_id: int
    type: str
    content: str

class NotificationRead(BaseModel):
    id: int
    user_id: int
    type: str
    content: str
    timestamp: datetime
    is_read: bool

    class Config:
        orm_mode = True
