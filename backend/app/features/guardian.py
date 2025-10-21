# backend/app/features/guardian.py
from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import os
import re

router = APIRouter(prefix="/guardian", tags=["guardian"])

# --- Tone presets (B = Friendly) ---
TONES = {
    "gentle": {
        "prefix": "Quick note—",
        "tips": {
            "money": "This sounds like a request for money. If you didn’t meet them IRL, be cautious.",
            "harassment": "That message may feel harsh. Want to soften it a bit?",
            "nsfw": "Careful—this might be too explicit. Consider rephrasing.",
            "generic": "Might be risky. Want to tweak it before sending?",
        },
    },
    "friendly": {  # <- Tone B
        "prefix": "Heads up—",
        "tips": {
            "money": "could be a scammy vibe. Avoid sending money or codes.",
            "harassment": "reads a little strong. Wanna reword it?",
            "nsfw": "might be too explicit for a first chat.",
            "generic": "maybe recheck the tone before sending.",
        },
    },
    "firm": {
        "prefix": "Warning:",
        "tips": {
            "money": "potential scam detected. Do NOT send money or codes.",
            "harassment": "message appears disrespectful or harassing.",
            "nsfw": "message appears explicit; consider community guidelines.",
            "generic": "message may be unsafe or inappropriate.",
        },
    },
    "witty": {
        "prefix": "Plot twist—",
        "tips": {
            "money": "that line screams ‘wire me cash’ energy. Hard pass?",
            "harassment": "spicy… maybe too spicy. Sprinkle kindness?",
            "nsfw": "PG-13 please—save the R-rated cut.",
            "generic": "maybe give that a remix before sending?",
        },
    },
}

# --- Simple keyword rules (Mode 2 base); you can swap to LLM scoring below ---
RULES = [
    ("money", re.compile(r"\b(send|give|transfer|wire)\b.*\b(money|cash|gift\s*card|crypto|bitcoin|code|otp)\b", re.I)),
    ("harassment", re.compile(r"\b(stupid|idiot|ugly|hate\s*you|kys)\b", re.I)),
    ("nsfw", re.compile(r"\b(nude|nudes|explicit|onlyfans|sex|hookup)\b", re.I)),
]

class CheckReq(BaseModel):
    text: str
    tone: str = "friendly"     # "gentle" | "friendly" | "firm" | "witty"
    mode: int = 2              # Mode 2 = rules + optional LLM scoring

class CheckResp(BaseModel):
    allowed: bool
    severity: float            # 0.0 - 1.0
    label: str                 # "money" | "harassment" | "nsfw" | "ok"
    tip: Optional[str] = None
    model_used: Optional[str] = None

def _rules_score(text: str):
    for label, rx in RULES:
        if rx.search(text or ""):
            # Simple severity mapping per label
            sev = {"money": 0.85, "harassment": 0.7, "nsfw": 0.65}.get(label, 0.5)
            return label, sev
    return "ok", 0.0

@router.post("/check", response_model=CheckResp)
async def check_guardian(req: CheckReq):
    tone = TONES.get(req.tone.lower(), TONES["friendly"])

    # 1) Rule score baseline
    label, sev = _rules_score(req.text)

    # 2) Optional: LLM refinement (if OPENAI_API_KEY set)
    model_used = None
    api_key = os.getenv("OPENAI_API_KEY")
    if req.mode >= 2 and api_key:
        try:
            # Lightweight pseudo-scoring to avoid external deps here.
            # If you want real LLM scoring, replace this block with your OpenAI call.
            # e.g., call OpenAI responses API and map to sev in [0,1].
            # For now, we just nudge sev slightly for long/insistent money asks.
            if label == "money" and len(req.text) > 120:
                sev = min(1.0, sev + 0.1)
            model_used = "rules+heuristic"  # replace with your LLM model id when enabled
        except Exception:
            pass

    if label == "ok":
        return CheckResp(allowed=True, severity=0.0, label="ok", tip=None, model_used=model_used)

    # Build tone-specific tip
    tip = f"{tone['prefix']} {tone['tips'].get(label, tone['tips']['generic'])}"
    allowed = sev < 0.6  # block if ≥ 0.6 (tune this)
    return CheckResp(allowed=allowed, severity=sev, label=label, tip=tip, model_used=model_used)

