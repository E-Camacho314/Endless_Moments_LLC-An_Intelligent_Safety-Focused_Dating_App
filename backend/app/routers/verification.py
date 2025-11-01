from fastapi import APIRouter, UploadFile, File

router = APIRouter(prefix="/verification", tags=["verification"])

@router.post("/submit")
async def submit_verification(file: UploadFile = File(...)):
    return {"ok": True, "filename": file.filename}
