from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from datetime import datetime
from .database import Base

class Profile(Base):
    __tablename__ = "profiles"

    user_id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    age = Column(Integer)
    city = Column(String)
    photos_json = Column(String)  # JSON string of photo URLs
    bio = Column(String)

class Swipe(Base):
    __tablename__ = "swipes"
    id = Column(Integer, primary_key=True, index=True)
    swiper_id = Column(Integer, ForeignKey("profiles.id"))
    swipee_id = Column(Integer, ForeignKey("profiles.id"))
    direction = Column(String)  # 'left' or 'right'
    timestamp = Column(DateTime, default=datetime.utcnow)

class Match(Base):
    __tablename__ = "matches"
    id = Column(Integer, primary_key=True, index=True)
    profile1_id = Column(Integer, ForeignKey("profiles.id"))
    profile2_id = Column(Integer, ForeignKey("profiles.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)