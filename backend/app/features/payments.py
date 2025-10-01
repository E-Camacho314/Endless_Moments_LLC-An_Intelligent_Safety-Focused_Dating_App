import os, stripe
from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel

router = APIRouter(prefix="/payments", tags=["payments"])
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "")

class CheckoutReq(BaseModel):
    mode: str
    price_id: str
    success_url: str
    cancel_url: str
    metadata: dict | None = None

@router.post("/checkout")
def checkout(req: CheckoutReq):
    if not stripe.api_key:
        raise HTTPException(500, "Stripe not configured")
    session = stripe.checkout.Session.create(
        mode=req.mode,
        line_items=[{"price": req.price_id, "quantity": 1}],
        success_url=req.success_url,
        cancel_url=req.cancel_url,
        allow_promotion_codes=True,
        metadata=req.metadata or {}
    )
    return {"url": session.url}

@router.post("/webhook")
async def webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature","")
    wh_secret = os.environ.get("STRIPE_WEBHOOK_SECRET","")
    try:
        event = stripe.Webhook.construct_event(payload, sig_header, wh_secret) if wh_secret else None
    except Exception as e:
        raise HTTPException(400, f"Webhook error: {e}")
    if event is None:
        event = await request.json()
    return {"received": True, "type": event.get("type") if isinstance(event, dict) else "unknown"}
