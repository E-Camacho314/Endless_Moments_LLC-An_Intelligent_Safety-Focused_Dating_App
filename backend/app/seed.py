from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from .database import engine, Base, SessionLocal
from .models import User, SafetyBadge, Profile, Circle, Event

def run():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    if not db.query(User).first():
        u = User(email="demo@lyra.app", name="Demo Student", bio="Foodie, film buff, into road trips.")
        db.add(u); db.flush()
        db.add(SafetyBadge(user_id=u.id, verified_id=True, verified_video=False, attended_event=True))
        db.add(Profile(user_id=u.id, city="Austin, TX", interests="street food, indie films, road trips"))
        c1 = Circle(slug="austin-techies", title="Austin Techies", city="Austin, TX")
        c2 = Circle(slug="dallas-musicians", title="Dallas Musicians", city="Dallas, TX")
        db.add_all([c1,c2]); db.flush()
        e1 = Event(circle_id=c1.id, title="Coffee & Code @ Cuvee", starts_at=datetime.utcnow()+timedelta(days=3), location="Cuvee Coffee, Austin")
        e2 = Event(circle_id=c2.id, title="Open Mic & Mingle", starts_at=datetime.utcnow()+timedelta(days=6), location="Deep Ellum, Dallas")
        db.add_all([e1,e2]); db.commit()
        print("Seeded demo user, profile, circles, events.")
    else:
        print("Seed already present.")
