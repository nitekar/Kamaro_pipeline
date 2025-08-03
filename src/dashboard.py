import streamlit as st
from PIL import Image
import numpy as np
import os
from src.prediction import load_model, predict_image, grad_cam

# Load model once
model = load_model("models/malnutrition_model.tf")
IMG_SIZE = (224, 224)

st.set_page_config(page_title="Malnutrition Classifier", layout="centered")
st.title("🧠 Malnutrition Image Classification")
st.markdown("Upload a child’s image to classify nutritional status and visualize model attention.")

uploaded_file = st.file_uploader("📤 Upload Image", type=["jpg", "jpeg", "png"])

if uploaded_file:
    img = Image.open(uploaded_file).convert("RGB")
    st.image(img, caption="Uploaded Image", use_column_width=True)

    # Save temporarily
    temp_path = f"temp/{uploaded_file.name}"
    os.makedirs("temp", exist_ok=True)
    img.save(temp_path)

    # Predict
    label, confidence = predict_image(model, temp_path, img_size=IMG_SIZE)
    st.success(f"Prediction: **{label}**")
    st.info(f"Confidence: `{confidence:.4f}`")

    # Grad-CAM toggle
    if st.checkbox("🔍 Show Grad-CAM"):
        st.markdown("Model attention visualization:")
        grad_cam(model, temp_path, img_size=IMG_SIZE)

    os.remove(temp_path)
