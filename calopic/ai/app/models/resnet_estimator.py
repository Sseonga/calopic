import torch
from torchvision import transforms
from PIL import Image

class WeightEstimator:
    def __init__(self, model_path):
        self.model = torch.load(model_path, map_location="cpu")
        self.model.eval()
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor()
        ])

    def predict_weight(self, image_path):
        image = Image.open(image_path)
        tensor = self.transform(image).unsqueeze(0)
        with torch.no_grad():
            weight = self.model(tensor).item()
        return weight
