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

# Load ResNet50 model with half precision
def load_model():
    model = models.resnet50()
    model = model.half()  # Set model to half precision
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    try:
        model.load_state_dict(torch.load(weights_path, map_location=device))
    except TypeError:
        # If weights_only=True is not supported, load weights without it
        model.load_state_dict(torch.load(weights_path, map_location=device))
    model = model.to(device)
    model.eval()
    return model, device

# Define the transformation for the model
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Lambda(lambda x: x.half())  # Use half precision for input
])

# Function to load image from a URL
def get_image_from_url(url):
    response = requests.get(url, stream=True)
    response.raise_for_status()  # Check for download errors
    image = Image.open(io.BytesIO(response.content))

    # Convert to RGB if the image has an alpha channel or is not in RGB mode
    if image.mode != 'RGB':
        image = image.convert('RGB')

    return image

# Extract features from an image URL
def get_features_from_url(url):
    model, device = load_model()
    image = get_image_from_url(url)
    image = transform(image).unsqueeze(0).to(device)  # Move to device
    with torch.inference_mode():
        features = model(image).cpu().numpy()  # Move back to CPU before converting to NumPy
    # Clean up model to free memory
    del model
    torch.cuda.empty_cache()  # Clear GPU memory if using CUDA
    return features

# Run the script from the command line
if __name__ == "__main__":
    url = sys.argv[1]
    features = get_features_from_url(url)
    print(json.dumps({"features": features.tolist()}))