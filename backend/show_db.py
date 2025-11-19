import json
from app.database import SessionLocal
from app.models import User, Profile, SafetyBadge, Circle, Event

def show_database_json():
    db = SessionLocal()

    def clean(obj):
        # convert SQLAlchemy object to dict without _sa_instance_state
        return {k: v for k, v in vars(obj).items() if k != '_sa_instance_state'}

    all_data = {
        "users": [clean(u) for u in db.query(User).all()],
        "profiles": [clean(p) for p in db.query(Profile).all()],
        "badges": [clean(b) for b in db.query(SafetyBadge).all()],
        "circles": [clean(c) for c in db.query(Circle).all()],
        "events": [clean(e) for e in db.query(Event).all()],
    }

    print(json.dumps(all_data, default=str, indent=2))
    db.close()

if __name__ == "__main__":
    show_database_json()
