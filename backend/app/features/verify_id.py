import os
from fastapi import APIRouter, Request
from pydantic import BaseModel

router = APIRouter(prefix="/verify-id", tags=["verify"])

class StartResp(BaseModel):
    provider: str
    client_token: str

@router.post("/start", response_model=StartResp)
def start_idv():
    token = "demo_token" if not os.getenv("PERSONA_API_KEY") else "persona_session_token"
    return {"provider":"persona","client_token": token}

@router.post("/webhook")
async def webhook_status(request: Request):
    payload = await request.json()
    return {"ok": True, "received": True}
