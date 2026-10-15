import os
import io
import time
import base64
import requests
from flask import Flask, request, jsonify
from PIL import Image, UnidentifiedImageError
import torch
from transformers import CLIPProcessor, CLIPModel

app = Flask(__name__)

# Constants
MODEL_ID = "openai/clip-vit-base-patch32"
PORT = int(os.environ.get("CLIP_SERVICE_PORT", 5001))

# Global Model References
device = None
model = None
processor = None

def get_device():
    global device
    if device is None:
        device = "cuda" if torch.cuda.is_available() else "cpu"
    return device

def load_clip_model():
    global model, processor, device
    if model is None or processor is None:
        dev = get_device()
        print(f"[CLIP-SERVICE] Loading model '{MODEL_ID}' on device: {dev}...")
        model = CLIPModel.from_pretrained(MODEL_ID)
        processor = CLIPProcessor.from_pretrained(MODEL_ID)
        model.to(dev)
        model.eval()
        print("[CLIP-SERVICE] Model loaded successfully.")

# Standard Indian Agricultural Crops supported in AquaVera
RECOGNIZED_CROPS = [
    "Wheat", "Rice", "Cotton", "Sugarcane", "Soybean", 
    "Maize", "Jowar", "Bajra", "Banana", "Onion", "Gram"
]

# Negative non-crop fraud control classes
FRAUD_CLASSES = [
    "an indoor room, bedroom, or furniture",
    "a selfie photo of a human face",
    "a document, receipt, paper, or computer screen",
    "a vehicle, road, or asphalt ground",
    "dry barren cracked dirt without any crops",
    "wild weeds or weeds in a lawn"
]

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "service": "AquaVera CLIP Crop Verifier",
        "model": MODEL_ID,
        "device": get_device(),
        "model_loaded": model is not None
    })

def resolve_image(data):
    """
    Extracts a PIL Image from URL, Base64 string, or local file path.
    """
    # Check any field that might contain a data URI or base64
    for key in ["imageBase64", "imageUrl", "imagePath", "image"]:
        val = data.get(key)
        if isinstance(val, str) and val.startswith("data:"):
            raw_b64 = val.split(",", 1)[1] if "," in val else val
            img_bytes = base64.b64decode(raw_b64)
            return Image.open(io.BytesIO(img_bytes)).convert("RGB")

    # 1. Base64
    if "imageBase64" in data and data["imageBase64"]:
        raw_b64 = data["imageBase64"]
        if "," in raw_b64:
            raw_b64 = raw_b64.split(",")[1]
        img_bytes = base64.b64decode(raw_b64)
        return Image.open(io.BytesIO(img_bytes)).convert("RGB")

    # 2. Remote URL
    if "imageUrl" in data and data["imageUrl"]:
        url = data["imageUrl"]
        res = requests.get(url, timeout=12)
        res.raise_for_status()
        return Image.open(io.BytesIO(res.content)).convert("RGB")

    # 3. Local file path
    if "imagePath" in data and data["imagePath"]:
        path = data["imagePath"]
        if not os.path.isabs(path):
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
            path = os.path.join(base_dir, path)
        if os.path.exists(path):
            return Image.open(path).convert("RGB")
        raise FileNotFoundError(f"Local image file not found at: {path}")

    raise ValueError("No valid image source provided (must provide 'imageUrl', 'imageBase64', or 'imagePath')")

@app.route("/verify-crop", methods=["POST"])
def verify_crop():
    start_time = time.time()
    data = request.get_json(silent=True) or {}

    declared_crop = (data.get("declaredCrop") or "Crop").strip()
    # Normalize crop name (e.g., "Wheat (Food Grains)" -> "Wheat")
    clean_declared_crop = declared_crop.split("(")[0].strip()

    # Load image
    try:
        image = resolve_image(data)
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Failed to retrieve image: {str(e)}"
        }), 400

    # Ensure model is ready
    load_clip_model()

    # Construct prompt labels for Zero-Shot Classification
    target_prompts = [
        f"a photo of {clean_declared_crop} crops growing in an agricultural field",
        f"a close-up photo of {clean_declared_crop} plants and leaves"
    ]

    other_crop_prompts = [
        f"a field of {c} crops" for c in RECOGNIZED_CROPS if c.lower() != clean_declared_crop.lower()
    ]

    all_prompts = target_prompts + other_crop_prompts + FRAUD_CLASSES

    # Run CLIP inference
    try:
        inputs = processor(
            text=all_prompts,
            images=image,
            return_tensors="pt",
            padding=True
        ).to(get_device())

        with torch.no_grad():
            outputs = model(**inputs)
            # Softmax to get probability distribution
            probs = outputs.logits_per_image.softmax(dim=1).cpu().numpy()[0]
    except Exception as e:
        return jsonify({
            "success": False,
            "error": f"Inference failed: {str(e)}"
        }), 500

    # Sum probability mass for the declared crop
    target_prob = float(probs[0] + probs[1])

    # Probability mass for non-crop fraud
    fraud_prob = float(sum(probs[-len(FRAUD_CLASSES):]))

    # Top class index
    top_idx = int(probs.argmax())
    top_prompt = all_prompts[top_idx]

    # Calculate calibrated confidence score (0-100)
    # If fraud/indoor prob is dominant, confidence drops heavily
    if fraud_prob > 0.45:
        confidence_score = max(5, int(round((1.0 - fraud_prob) * 35)))
    else:
        # Scale target crop probability against competing crops
        relative_conf = target_prob / max(1e-5, (target_prob + sum(probs[2:-len(FRAUD_CLASSES)])))
        confidence_score = int(round(relative_conf * 100))
        confidence_score = max(10, min(99, confidence_score))

    is_anomaly = confidence_score < 60 or fraud_prob > 0.40
    geo_status = "Invalid" if is_anomaly else "Valid"

    elapsed_ms = int((time.time() - start_time) * 1000)

    return jsonify({
        "success": True,
        "declaredCrop": clean_declared_crop,
        "confidenceScore": confidence_score,
        "isAnomaly": is_anomaly,
        "geoStatus": geo_status,
        "topDetectedMatch": top_prompt,
        "fraudScore": round(fraud_prob * 100, 1),
        "modelVersion": MODEL_ID,
        "latencyMs": elapsed_ms
    })

if __name__ == "__main__":
    load_clip_model()
    print(f"[CLIP-SERVICE] Starting HTTP server on port {PORT}...")
    app.run(host="0.0.0.0", port=PORT, threaded=True)
