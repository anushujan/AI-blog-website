from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from io import BytesIO
from PIL import Image
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
import numpy as np

app = FastAPI()

# Allow all origins (for development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
try:
    model = tf.keras.models.load_model('violent_content_model.h5')
except Exception as e:
    model = None
    print(f"Error loading model: {e}")

def prepare_image(image: Image.Image, target_size):
    if image.mode != "RGB":
        image = image.convert("RGB")
    image = image.resize(target_size)
    image = img_to_array(image)
    image = np.expand_dims(image, axis=0)
    return image / 255.0

class ImageClassificationResponse(BaseModel):
    classification: str

@app.post("/classify", response_model=ImageClassificationResponse)
async def classify(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # Convert the uploaded file to an image
        image = Image.open(BytesIO(await file.read()))
        image = prepare_image(image, target_size=(150, 150))

        # Predict with the model
        prediction = model.predict(image)[0][0]
        result = "violent" if prediction > 0.7 else "non-violent"

        return ImageClassificationResponse(classification=result)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f"Error processing image: {e}")

if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, port=9000)

