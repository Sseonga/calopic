from fastapi import FastAPI, UploadFile, File
from app.models.yolov8_detector import FoodDetector
from app.models.resnet_estimator import WeightEstimator
from PIL import Image
import io
import tempfile

app = FastAPI()

detector = FoodDetector("models/yolov8_food.pt")
estimator = WeightEstimator("models/resnet_weight.pt")

@app.post("/analyze")
async def analyze_food(image: UploadFile = File(...)):
    # 1. 이미지 저장
    img_bytes = await image.read()
    tmp_path = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    tmp_path.write(img_bytes)
    tmp_path.close()

    # 2. 1단계: 음식 감지
    detections = detector.detect(tmp_path.name)

    # 3. 2단계: 감지된 음식별 중량 추정
    results = []
    for det in detections:
        crop = Image.open(tmp_path.name).crop(det["bbox"])
        crop_path = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg").name
        crop.save(crop_path)
        weight = estimator.predict_weight(crop_path)
        results.append({
            "class_id": det["class_id"],
            "bbox": det["bbox"],
            "weight": weight
        })

    return {"results": results}
