from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import base64
import numpy as np
import cv2
from deepface import DeepFace
from transformers import pipeline
import io
from PIL import Image

app = FastAPI(title="AI Emotion Recognition API", version="1.0.0")

# Allow frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load text emotion model once at startup
text_emotion_pipeline = None

@app.on_event("startup")
async def load_models():
    global text_emotion_pipeline
    print("Loading text emotion model...")
    text_emotion_pipeline = pipeline(
        "text-classification",
        model="j-hartmann/emotion-english-distilroberta-base",
        return_all_scores=True
    )
    print("Models loaded successfully!")


# ─────────────────────────────────────────────
# Health Check
# ─────────────────────────────────────────────
@app.get("/")
def read_root():
    return {"status": "ok", "message": "Emotion Recognition API is running"}


# ─────────────────────────────────────────────
# Face Emotion from Image (base64)
# ─────────────────────────────────────────────
class ImagePayload(BaseModel):
    image: str  # base64 encoded image

@app.post("/analyze/face")
async def analyze_face(payload: ImagePayload):
    try:
        # Decode base64 image
        image_data = payload.image.split(",")[1] if "," in payload.image else payload.image
        image_bytes = base64.b64decode(image_data)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            raise HTTPException(status_code=400, detail="Invalid image data")

        # Analyze with DeepFace
        result = DeepFace.analyze(
            img,
            actions=["emotion"],
            enforce_detection=False,
            silent=True
        )

        if isinstance(result, list):
            result = result[0]

        emotions = result["emotion"]
        dominant = result["dominant_emotion"]

        # Normalize scores to percentages
        total = sum(emotions.values())
        normalized = {k: round((v / total) * 100, 2) for k, v in emotions.items()}

        return {
            "success": True,
            "dominant_emotion": dominant,
            "emotions": normalized,
            "face_detected": True
        }

    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "face_detected": False,
            "dominant_emotion": "unknown",
            "emotions": {}
        }


# ─────────────────────────────────────────────
# Text Emotion Analysis
# ─────────────────────────────────────────────
class TextPayload(BaseModel):
    text: str

@app.post("/analyze/text")
async def analyze_text(payload: TextPayload):
    try:
        if not payload.text.strip():
            raise HTTPException(status_code=400, detail="Text cannot be empty")

        results = text_emotion_pipeline(payload.text)[0]

        # Sort by score descending
        sorted_emotions = sorted(results, key=lambda x: x["score"], reverse=True)

        # Convert to percentage dict
        emotions = {
            item["label"].lower(): round(item["score"] * 100, 2)
            for item in sorted_emotions
        }

        dominant = sorted_emotions[0]["label"].lower()

        return {
            "success": True,
            "dominant_emotion": dominant,
            "emotions": emotions,
            "text_analyzed": payload.text
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
