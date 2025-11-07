from fastapi import APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
import cv2
import numpy as np
from PIL import Image, ImageOps
import io
import mediapipe as mp

router = APIRouter(prefix="/verification", tags=["verification"])

class VerificationResponse(BaseModel):
    status: str
    clarity: float | None = None
    faces_detected: int | None = None
    brightness: float | None = None
    face_ratio: float | None = None
    reason: str | None = None

# --- Tunables (start here if you need to tweak) ---
MIN_WIDTH = 240
MIN_HEIGHT = 240
MAX_SIDE = 1600              # downscale very large selfies
MIN_CLARITY = 20.0           # Laplacian variance threshold (selfies often 18–60)
MIN_BRIGHTNESS = 35.0        # grayscale mean; <35 is quite dark
MIN_FACE_RATIO = 0.05        # largest face must be >= 5% of the frame area
MP_CONF = 0.35               # mediapipe min_detection_confidence (0.3–0.5 works well)
DEBUG = True                 # set False in prod

mp_face = mp.solutions.face_detection

def _debug(*args):
    if DEBUG:
        print("[verify]", *args)

def _load_image(data: bytes) -> np.ndarray | None:
    """
    Load bytes -> Pillow Image (EXIF-aware) -> RGB -> BGR numpy for OpenCV.
    """
    try:
        pil = Image.open(io.BytesIO(data))
        # Apply EXIF orientation (crucial for iPhone/Android)
        pil = ImageOps.exif_transpose(pil).convert("RGB")
        arr = np.array(pil)                   # RGB HxWx3 uint8
        bgr = cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)
        return bgr
    except Exception as e:
        _debug("load_image error:", e)
        return None

def _downscale_if_needed(img: np.ndarray) -> np.ndarray:
    h, w = img.shape[:2]
    max_side = max(h, w)
    if max_side <= MAX_SIDE:
        return img
    scale = MAX_SIDE / float(max_side)
    new_w, new_h = int(w * scale), int(h * scale)
    return cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_AREA)

def _evaluate_image(image: np.ndarray) -> tuple[bool, dict]:
    # minimal size check
    h, w = image.shape[:2]
    if w < MIN_WIDTH or h < MIN_HEIGHT:
        return False, {"reason": "Image is too small for verification."}

    # downscale huge images to help detector
    image = _downscale_if_needed(image)
    h, w = image.shape[:2]

    # basic metrics
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    brightness = float(gray.mean())

    # Use mild CLAHE to stabilize contrast for blur metric (doesn't alter face content)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
    gray_eq = clahe.apply(gray)

    clarity = float(cv2.Laplacian(gray_eq, cv2.CV_64F).var())

    _debug(f"size={w}x{h} brightness={brightness:.2f} clarity={clarity:.2f}")

    if brightness < MIN_BRIGHTNESS:
        return False, {
            "brightness": brightness,
            "clarity": clarity,
            "reason": "Photo is too dark. Move to better light or face a light source."
        }

    if clarity < MIN_CLARITY:
        return False, {
            "brightness": brightness,
            "clarity": clarity,
            "reason": "Photo looks blurry. Hold the phone steady and refocus."
        }

    # --- Face detection (selfie range) ---
    with mp_face.FaceDetection(model_selection=0, min_detection_confidence=MP_CONF) as detector:
        results = detector.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

    if not results.detections:
        return False, {
            "brightness": brightness,
            "clarity": clarity,
            "reason": "No face detected. Center your face, remove masks/sunglasses, and try again."
        }

    # compute largest face ratio
    face_areas = []
    for det in results.detections:
        bbox = det.location_data.relative_bounding_box
        fx, fy, fw, fh = bbox.xmin, bbox.ymin, bbox.width, bbox.height
        # Clamp to [0,1] to avoid edge numeric issues
        fx, fy = max(0.0, fx), max(0.0, fy)
        fw, fh = max(0.0, fw), max(0.0, fh)
        area_ratio = float(fw * fh)
        face_areas.append(area_ratio)

    largest_ratio = max(face_areas) if face_areas else 0.0
    _debug(f"faces={len(face_areas)} largest_face_ratio={largest_ratio:.4f}")

    if largest_ratio < MIN_FACE_RATIO:
        return False, {
            "brightness": brightness,
            "clarity": clarity,
            "faces_detected": len(face_areas),
            "face_ratio": largest_ratio,
            "reason": "Face is too small in the frame. Move closer or crop to your head & shoulders."
        }

    return True, {
        "brightness": brightness,
        "clarity": clarity,
        "faces_detected": len(face_areas),
        "face_ratio": largest_ratio
    }

@router.post("/submit", response_model=VerificationResponse)
async def submit_verification(file: UploadFile = File(...)):
    print(">>> USING THIS VERIFICATION FILE <<<")   # For debugging
    
    content = await file.read()

    
    image = _load_image(content)

    if image is None:
        raise HTTPException(status_code=400, detail="Invalid or unreadable image format.")

    success, details = _evaluate_image(image)

    if not success:
        return VerificationResponse(status="rejected", **details)

    return VerificationResponse(status="verified", **details)
