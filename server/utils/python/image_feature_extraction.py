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
weights_path = os.path.join(os.path.dirname(__file__), "checkpoints", "resnet50-0676ba61.pth")

# Load ResNet50 model with local weights
model = models.resnet50()
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.load_state_dict(torch.load(weights_path))
model.eval()

# Define the transformation for the model
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# Function to load image from a URL
def get_image_from_url(url):
    response = requests.get(url)
    response.raise_for_status()  # Check for download errors
    image = Image.open(io.BytesIO(response.content))

    # Convert to RGB if the image has an alpha channel or is not in RGB mode
    if image.mode != 'RGB':
        image = image.convert('RGB')

    return image

# Extract features from an image URL
def get_features_from_url(url):
    image = get_image_from_url(url)
    image = transform(image).unsqueeze(0)
    with torch.no_grad():
        features = model(image).numpy()
    return features

# Run the script from the command line
if __name__ == "__main__":
    url = sys.argv[1]
    features = get_features_from_url(url)
    print(json.dumps({"features": features.tolist()}))
