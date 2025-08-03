from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import shutil, os
from src.prediction import load_model, predict_image

app = FastAPI(title="Malnutrition Classification API")

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model("models/malnutrition_model.tf")
IMG_SIZE = (224, 224)

@app.post("/predict/")
async def predict(file: UploadFile = File(...)):
    try:
        temp_path = f"temp/{file.filename}"
        os.makedirs("temp", exist_ok=True)
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        label, confidence = predict_image(model, temp_path, img_size=IMG_SIZE)
        os.remove(temp_path)

        return JSONResponse(content={
            "prediction": label,
            "confidence": round(confidence, 4)
        })

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})
    