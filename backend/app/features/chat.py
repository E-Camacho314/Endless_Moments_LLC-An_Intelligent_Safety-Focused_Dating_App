from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Conversation, Message, Match

router = APIRouter(prefix="/chat", tags=["chat"])

class PostMessageReq(BaseModel):
    conversation_id: int
    sender_id: int
    text: str

@router.post("/messages")
def post_message(req: PostMessageReq, db: Session = Depends(get_db)):
    m = Message(conversation_id=req.conversation_id, sender_id=req.sender_id, text=req.text)
    db.add(m); db.commit()
    return {"ok": True, "message_id": m.id}

# Simple in-memory ws registry (single-process demo)
connections = {}

@router.websocket("/ws/{conversation_id}")
async def ws_chat(ws: WebSocket, conversation_id: int):
    await ws.accept()
    group = connections.setdefault(conversation_id, set())
    group.add(ws)
    try:
        while True:
            payload = await ws.receive_text()
            # fan-out to others
            for peer in list(group):
                try:
                    if peer is not ws:
                        await peer.send_text(payload)
                except Exception:
                    try:
                        group.remove(peer)
                    except KeyError:
                        pass
    except WebSocketDisconnect:
        group.remove(ws)
