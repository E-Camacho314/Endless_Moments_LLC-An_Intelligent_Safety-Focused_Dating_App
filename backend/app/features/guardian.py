from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/guardian", tags=["guardian"])

class CheckReq(BaseModel):
    text: str
    tone: str = "gentle"

TIPS = {
    "gentle": "Heads up—this might be risky. Avoid sending money or personal info.",
    "firm": "Stop. This is a classic scam signal. Do not send money or sensitive info.",
    "witty": "Plot twist: scammers hate boundaries. Keep your wallet and your heart safe 😉"
}

@router.post("/check")
def check(req: CheckReq):
    risky = any(k in req.text.lower() for k in ["send money", "wire", "crypto", "gift card", "bank"])
    if not risky:
        return {"ok": True}
    return {"ok": False, "nudge": TIPS.get(req.tone, TIPS["gentle"])}
