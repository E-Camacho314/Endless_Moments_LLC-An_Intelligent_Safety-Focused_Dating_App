from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Boolean, DateTime, ForeignKey, Text
from datetime import datetime
from .database import Base
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base


class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(120), default="")
    bio: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    badges = relationship("SafetyBadge", back_populates="user", uselist=False)

class SafetyBadge(Base):
    __tablename__ = "safety_badges"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), index=True)
    verified_id: Mapped[bool] = mapped_column(Boolean, default=False)
    verified_video: Mapped[bool] = mapped_column(Boolean, default=False)
    attended_event: Mapped[bool] = mapped_column(Boolean, default=False)
    user = relationship("User", back_populates="badges")

# inside models.py, replace or update Profile definition:
class Profile(Base):
    __tablename__ = "profiles"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    display_name = Column(String, nullable=False)  # ✅ add this
    age = Column(Integer, nullable=True)
    bio = Column(String, nullable=True)
    circle = Column(String, nullable=True)  # ✅ campus circle support
    badges = Column(String, nullable=True)  # ✅ comma list: "ID Verified,Video Verified"
    photo_url = Column(String, nullable=True)  # ✅ simple photo version
    occupation = Column(String, nullable=True)
    location = Column(String, nullable=True)
    pronouns = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    preference = Column(String, nullable=True)
    interests = Column(String, nullable=True)
    relationship_goals = Column(String, nullable=True)
    member_since = Column(String, nullable=True)

class Interaction(Base):
    __tablename__ = "interactions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    actor_id: Mapped[int] = mapped_column(index=True)
    target_id: Mapped[int] = mapped_column(index=True)
    action: Mapped[str] = mapped_column(String(16)) # 'like' | 'pass'
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Match(Base):
    __tablename__ = "matches"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_a: Mapped[int] = mapped_column(index=True)
    user_b: Mapped[int] = mapped_column(index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Conversation(Base):
    __tablename__ = "conversations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    match_id: Mapped[int] = mapped_column(index=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Message(Base):
    __tablename__ = "messages"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    conversation_id: Mapped[int] = mapped_column(index=True)
    sender_id: Mapped[int] = mapped_column(index=True)
    text: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    reporter_id: Mapped[int] = mapped_column(index=True)
    target_user_id: Mapped[int] = mapped_column(index=True)
    reason: Mapped[str] = mapped_column(String(64))
    details: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class ModerationAction(Base):
    __tablename__ = "moderation_actions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    target_user_id: Mapped[int] = mapped_column(index=True)
    action: Mapped[str] = mapped_column(String(32))  # warn|mute|ban|delete
    moderator_id: Mapped[int] = mapped_column(index=True)
    notes: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

class DailyMetrics(Base):
    __tablename__ = "daily_metrics"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    day: Mapped[str] = mapped_column(String(10), index=True)  # YYYY-MM-DD
    new_users: Mapped[int] = mapped_column(Integer, default=0)
    likes: Mapped[int] = mapped_column(Integer, default=0)
    matches: Mapped[int] = mapped_column(Integer, default=0)
    messages: Mapped[int] = mapped_column(Integer, default=0)

class Circle(Base):
    __tablename__ = "circles"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    slug: Mapped[str] = mapped_column(String(64), unique=True, index=True)
    title: Mapped[str] = mapped_column(String(120))
    city: Mapped[str] = mapped_column(String(120))

class Event(Base):
    __tablename__ = "events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    circle_id: Mapped[int] = mapped_column(index=True)
    title: Mapped[str] = mapped_column(String(200))
    starts_at: Mapped[datetime] = mapped_column(DateTime)
    location: Mapped[str] = mapped_column(String(200))

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True) 
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    type = Column(String, index=True)
    content = Column(String)
    timestamp = Column(DateTime, default=func.now(), index=True)
    is_read = Column(Boolean, default=False)
    