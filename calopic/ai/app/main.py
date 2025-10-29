from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File
from ultralytics import YOLO
import torch
from torchvision import transforms
import torchvision.models as models
import torchvision.models.resnet as resnet
from PIL import Image
import tempfile
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
name_file_path = os.path.join(BASE_DIR, "models", "data", "food.names")
yolo_file_path = os.path.join(BASE_DIR, "models", "best.pt")
resnet_file_path = os.path.join(BASE_DIR, "models", "new_opencv_ckpt_b84_e200.pth")

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React 개발 서버 주소
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 안전한 클래스 등록
torch.serialization.add_safe_globals([resnet.ResNet])

# ✅ 클래스 이름 로드
with open(name_file_path, "r", encoding="utf-8") as f:
    class_names = [line.strip() for line in f.readlines()]

# 모델 구조를 다시 선언
resnet_model = models.resnet18(weights=None)

# fc 레이어 수정 (클래스 수를 5로 맞춤)
num_ftrs = resnet_model.fc.in_features
resnet_model.fc = torch.nn.Linear(num_ftrs, 5)

# state_dict 로드 (딕셔너리 감싸진 경우 처리)
checkpoint = torch.load(resnet_file_path, map_location="cpu", weights_only=False)
state_dict = checkpoint["state_dict"] if "state_dict" in checkpoint else checkpoint
resnet_model.load_state_dict(state_dict, strict=False)
resnet_model.eval()

# ✅ YOLO 모델 로드
yolo_model = YOLO(yolo_file_path)

# 입력 이미지 전처리 (ResNet용)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

def crop_image_by_box(image_path, box):
    img = Image.open(image_path).convert("RGB")
    x1, y1, x2, y2 = [int(v) for v in box]
    cropped = img.crop((x1, y1, x2, y2))
    return cropped

def estimate_weight(image_pil):
    """ResNet 모델에 크롭된 이미지 넣어서 양 추정"""
    with torch.no_grad():
        img_tensor = transform(image_pil).unsqueeze(0)  # (1,3,224,224)
        output = resnet_model(img_tensor)
        pred_class = torch.argmax(output, dim=1).item()
        # weight = output.item()
    return pred_class

@app.post("/detect")
async def detect_food(file: UploadFile = File(...)):
    # 1. 이미지 임시 저장
    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".jpg")
    tmp.write(await file.read())
    tmp.close()

    # 2. YOLO 탐지
    results = yolo_model(tmp.name)

    # 3. 탐지 결과 처리
    detections = []
    for box in results[0].boxes:
        class_id = int(box.cls)
        confidence = float(box.conf)
        bbox = box.xyxy[0].tolist()

        # 4. 크롭 이미지 생성
        cropped_img = crop_image_by_box(tmp.name, bbox)

        # 5. ResNet으로 양 추정
        estimated_weight = estimate_weight(cropped_img)

        detections.append({
            "class_id": class_id,
            "class_name": results[0].names[class_id],
            "confidence": confidence,
            "estimated_weight": estimated_weight+1,
            "bbox": bbox,
        })

    # ✅ 결과 JSON으로 반환
    return {"detections": detections}
