from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/ai", tags=["ai"])

class PromptReq(BaseModel):
    seed: str

@router.post("/profile-prompts")
def profile_prompts(req: PromptReq):
    ideas = [
        f"Ask me about: {req.seed}",
        "Two truths & a lie?",
        "The nerdiest thing I love is...",
        "My dream weekend looks like..."
    ]
    return {"suggestions": ideas[:4]}

class PhotoReq(BaseModel):
    url: str
@router.post("/photo-tips")
def photo_tips(req: PhotoReq):
    return {"tips": ["Use natural light", "Avoid heavy filters", "Smile genuinely"]}
