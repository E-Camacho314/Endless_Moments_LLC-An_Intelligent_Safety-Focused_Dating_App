from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from .database import engine, Base, SessionLocal
from .models import User, SafetyBadge, Profile, Circle, Event

def run():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    # Seed test/demo user
    if not db.query(User).filter(User.id == 999).first():
        # Create test user with id=999
        user = User(
            id=999,
            email="testuser@lyra.app",
            name="John Doe",
            bio="Building technology that connects people meaningfully. Traveler, pianist, and cat dad."
        )
        db.add(user)
        db.flush()

        # Safety badge
        badge = SafetyBadge(
            user_id=user.id,
            verified_id=True,
            verified_video=True,
            attended_event=True
        )
        db.add(badge)

        # Full profile
        profile = Profile(
            user_id=user.id,
            display_name="John Doe",
            age=27,
            bio="Building technology that connects people meaningfully. Traveler, pianist, and cat dad.",
            circle="Main Campus",
            badges="ID Verified,Video Verified",
            photo_url="/test-profile.png",
            occupation="Software Engineer",
            location="San Francisco, CA",
            pronouns="He/Him",
            gender="Male",
            preference="Female",
            interests="Hiking, AI, Music, Travel",
            relationship_goals="Long-term connection",
            member_since="March 2025"
        )
        db.add(profile)

        # Seed some circles
        c1 = Circle(slug="austin-techies", title="Austin Techies", city="Austin, TX")
        c2 = Circle(slug="dallas-musicians", title="Dallas Musicians", city="Dallas, TX")
        db.add_all([c1, c2])
        db.flush()

        # Seed events
        e1 = Event(circle_id=c1.id, title="Coffee & Code @ Cuvee", starts_at=datetime.utcnow()+timedelta(days=3), location="Cuvee Coffee, Austin")
        e2 = Event(circle_id=c2.id, title="Open Mic & Mingle", starts_at=datetime.utcnow()+timedelta(days=6), location="Deep Ellum, Dallas")
        db.add_all([e1, e2])

        db.commit()
        print("✅ Seeded test user 999, profile, circles, and events.")
    else:
        print("⚠️ Test user 999 already exists.")

    # Optionally, seed a demo user if you want another non-999 user
    if not db.query(User).filter(User.email=="demo@lyra.app").first():
        demo = User(
            email="demo@lyra.app",
            name="Demo Student",
            bio="Foodie, film buff, into road trips."
        )
        db.add(demo)
        db.flush()

        db.add(SafetyBadge(user_id=demo.id, verified_id=True, verified_video=False, attended_event=True))

        db.add(Profile(
            user_id=demo.id,
            display_name="Demo Student",
            age=22,
            bio="Foodie, film buff, into road trips.",
            circle="Demo Circle",
            badges="ID Verified",
            photo_url="/default-avatar.png",
            occupation="Student",
            location="Austin, TX",
            pronouns="They/Them",
            gender="Non-binary",
            preference="Any",
            interests="Food, Film, Travel",
            relationship_goals="Friendships",
            member_since="January 2025"
        ))

        db.commit()
        print("✅ Seeded demo user, profile, and badges.")
    else:
        print("⚠️ Demo user already exists.")
