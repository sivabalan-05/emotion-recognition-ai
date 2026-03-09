from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import base64
import numpy as np
import cv2
from deepface import DeepFace
from transformers import pipeline

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
text_pipeline = None

@app.on_event("startup")
async def load_models():
    global text_pipeline
    print("Loading text emotion model...")
    text_pipeline = pipeline("text-classification", model="j-hartmann/emotion-english-distilroberta-base", return_all_scores=True)
    print("Models loaded successfully!")

@app.get("/")
def root():
    return {"status": "ok"}

class ImagePayload(BaseModel):
    image: str

class TextPayload(BaseModel):
    text: str

@app.post("/analyze/face")
async def analyze_face(payload: ImagePayload):
    try:
        image_data = payload.image.split(",")[1] if "," in payload.image else payload.image
        np_arr = np.frombuffer(base64.b64decode(image_data), np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        result = DeepFace.analyze(img, actions=["emotion"], enforce_detection=False, silent=True)
        if isinstance(result, list):
            result = result[0]
        emotions = {k: round(float(v), 2) for k, v in result["emotion"].items()}
        return {"success": True, "dominant_emotion": result["dominant_emotion"], "emotions": emotions, "face_detected": True}
    except Exception as e:
        return {"success": False, "error": str(e), "face_detected": False, "dominant_emotion": "unknown", "emotions": {}}

@app.post("/analyze/text")
async def analyze_text(payload: TextPayload):
    try:
        raw = text_pipeline(payload.text)[0]
        results = sorted(raw, key=lambda x: float(x["score"]), reverse=True)
        emotions = {r["label"].lower(): round(float(r["score"]) * 100, 2) for r in results}
        return {"success": True, "dominant_emotion": results[0]["label"].lower(), "emotions": emotions, "text_analyzed": payload.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)