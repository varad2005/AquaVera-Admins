# AquaVera CLIP Crop Detection & AI Verification Service

Lightweight zero-shot computer vision microservice using **OpenAI CLIP (`openai/clip-vit-base-patch32`)** to verify field evidence photos against declared agricultural crops and prevent fraudulent non-agricultural submissions.

---

## 🌾 Capabilities

1. **Zero-Shot Crop Classification:**
   - Evaluates evidence photos directly against target crop prompts (e.g., *"a photo of Wheat crops growing in an agricultural field"*).
   - Validates declared crops against competing crops commonly cultivated across India (Rice, Cotton, Sugarcane, Soybean, Maize, Jowar, Bajra, Banana, Onion, Gram).

2. **Anti-Fraud & Indoor Anomaly Detection:**
   - Incorporates negative prompt anchors (e.g., *"indoor room"*, *"selfie photo of a human face"*, *"document/paper"*, *"cracked dirt without crops"*).
   - If fraud probability mass exceeds the threshold, the service penalizes the confidence score and sets `geoStatus: "Invalid"` with `isAnomaly: true`.

3. **Decoupled Architecture with Fail-Safe Fallback:**
   - Runs as an independent HTTP microservice on port `5001`.
   - The Express API server connects via `POST /verify-crop` with a 6-second timeout.
   - If the microservice is offline or initializing, Express falls back to safe heuristics without blocking farmer request submissions or crashing.

---

## 🚀 Setup & Execution

### 1. Requirements
- Python 3.10+ (tested with Python 3.14)
- PyTorch (`torch`)
- Hugging Face Transformers (`transformers`)
- Pillow (`Pillow`)
- Flask (`flask`)
- Requests (`requests`)

### 2. Start Service
```bash
# Activate virtual environment
artifacts/clip-service/.venv/Scripts/python.exe artifacts/clip-service/app.py
```

The service will listen on `http://127.0.0.1:5001`.

---

## 📡 API Endpoints

### `GET /health`
Returns service status, device (`cuda` or `cpu`), and model readiness.

### `POST /verify-crop`
Performs zero-shot crop inference.

**Payload:**
```json
{
  "declaredCrop": "Wheat",
  "imageBase64": "data:image/jpeg;base64,...", // OR "imageUrl", OR "imagePath"
}
```

**Response:**
```json
{
  "success": true,
  "declaredCrop": "Wheat",
  "confidenceScore": 89,
  "isAnomaly": false,
  "geoStatus": "Valid",
  "topDetectedMatch": "a photo of Wheat crops growing in an agricultural field",
  "fraudScore": 4.2,
  "modelVersion": "openai/clip-vit-base-patch32",
  "latencyMs": 145
}
```
