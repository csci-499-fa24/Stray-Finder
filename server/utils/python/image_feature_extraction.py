import requests
from PIL import Image
import torch
import torchvision.transforms as transforms
from torchvision import models
import io
import sys
import json
import os

# Define the path to the local weights file
weights_path = os.path.join(os.path.dirname(__file__), "checkpoints", "mobilenet_v2-b0353104.pth")

# Load a lightweight MobileNetV2 model instead of ResNet50
def load_model():
    model = models.mobilenet_v2()
    model = model.half()  # Use half precision to save memory
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    try:
        model.load_state_dict(torch.load(weights_path, map_location=device))
    except TypeError:
        model.load_state_dict(torch.load(weights_path, map_location=device))
    model = model.to(device)
    model.eval()
    return model, device

# Set optimized PyTorch settings if CUDA is available
torch.backends.cudnn.benchmark = True
torch.backends.cudnn.deterministic = True

# Define a smaller transformation
transform = transforms.Compose([
    transforms.Resize((160, 160)),  # Reduced image size
    transforms.ToTensor(),
    transforms.Lambda(lambda x: x.half())  # Half precision
])

# Function to load image from a URL
def get_image_from_url(url):
    response = requests.get(url, stream=True)
    response.raise_for_status()  # Check for download errors
    image = Image.open(io.BytesIO(response.content))
    if image.mode != 'RGB':
        image = image.convert('RGB')
    return image

# Extract features from an image URL
def get_features_from_url(url):
    model, device = load_model()
    image = get_image_from_url(url)
    image = transform(image).unsqueeze(0).to(device)
    with torch.inference_mode():
        features = model(image).cpu().numpy()
    # Clean up model to free memory
    del model
    torch.cuda.empty_cache()
    return features

# Run the script from the command line
if __name__ == "__main__":
    url = sys.argv[1]
    features = get_features_from_url(url)
    print(json.dumps({"features": features.tolist()}))
