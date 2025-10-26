from ultralytics import YOLO

class FoodDetector:
    def __init__(self, model_path):
        self.model = YOLO(model_path)

    def detect(self, image_path):
        results = self.model(image_path)
        detections = []
        for r in results:
            for box in r.boxes:
                detections.append({
                    "class_id": int(box.cls),
                    "confidence": float(box.conf),
                    "bbox": box.xyxy[0].tolist()
                })
        return detections
