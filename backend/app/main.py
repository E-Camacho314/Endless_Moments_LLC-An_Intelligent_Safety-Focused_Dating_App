from fastapi import FastAPI
from .database import Base, engine
halklooiofbiuivsivihsdvs

# Routers
from .features.guardian import router as guardian_router
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
from .routers import verification
from app.routers import auth
from fastapi.middleware.cors import CORSMiddleware


# ✅ Create app ONLY ONCE
app = FastAPI(title="Lyra API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"ok": True}

@app.get("/")
def root():
    return {"status": "ok", "message": "Lyra Backend is running 🚀"}

# ✅ Now include routers (and they will actually register!)
app.include_router(guardian_router)
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
app.include_router(verification.router)  # <--- Your verification API is now REAL
app.include_router(auth.router)
