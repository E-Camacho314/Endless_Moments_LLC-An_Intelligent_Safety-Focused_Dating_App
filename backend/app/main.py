from fastapi import FastAPI
# backend/app/main.py
from .features.guardian import router as guardian_router
app = FastAPI()
# (… existing routers …)
app.include_router(guardian_router)

from .database import Base, engine
from .features.ai import router as ai_router
from .features.matches import router as matches_router
from .features.chat import router as chat_router
from .features.reports import router as reports_router
from .features.metrics import router as metrics_router
from .features.profiles import router as profiles_router
from .features.safety_view import router as safety_router
from .features.events import router as events_router
from .features.verify_id import router as verify_router
from .features.payments import router as payments_router
from .features import feed

app = FastAPI(title="Lyra API")
Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"ok": True}
@app.get("/")
def root():
    return {"status": "ok", "message": "Lyra Backend is running 🚀"}

app.include_router(ai_router)
app.include_router(matches_router)
app.include_router(chat_router)
app.include_router(reports_router)
app.include_router(metrics_router)
app.include_router(profiles_router)
app.include_router(safety_router)
app.include_router(events_router)
app.include_router(verify_router)
app.include_router(payments_router)
app.include_router(feed.router)
