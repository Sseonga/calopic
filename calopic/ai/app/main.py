from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
import tempfile
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
name_file_path = os.path.join(BASE_DIR, "models", "data", "food.names")
yolo_file_path = os.path.join(BASE_DIR, "models", "best.pt")

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 개발 서버 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ 클래스 이름 로드
with open(name_file_path, "r", encoding="utf-8") as f:
    class_names = [line.strip() for line in f.readlines()]

# ✅ YOLO 모델 로드
model = YOLO(yolo_file_path)

@app.post("/detect")
async def detect_food(file: UploadFile = File(...)):
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    tmp.write(await file.read())
    tmp.close()

    # ✅ YOLO 탐지 실행
    results = model(tmp.name)

    detections = []
    for box in results[0].boxes:
        cls_id = int(box.cls)
        detections.append({
            "class_id": cls_id,
            "class_name": class_names[cls_id] if cls_id < len(class_names) else "Unknown",
            "confidence": float(box.conf),
            "bbox": box.xyxy[0].tolist()
        })

    # ✅ 결과 JSON으로 반환
    return {"detections": detections}
