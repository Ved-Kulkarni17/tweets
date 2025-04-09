from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
import random as rd
from fastapi.middleware.cors import CORSMiddleware
import math
app = FastAPI()
predictor = PredictorSentiment("model_artifacts")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],  
)

def get_weighted_score():
    decay_factor = 0.2  # Closer to 1 = stronger decay
    weighted_random = 0.6 + (0.6 * (1 - math.exp(-decay_factor * rd.random())))
    return weighted_random

@app.get("/")
def home():
    return {"message": "Smart Contract Risk Prediction API is running"}

class CodeInput(BaseModel):
    code: str
    contract_name: Optional[str] = None

@app.post("/predict")
async def predict(request: CodeInput):
    try:
        if len(request.code) < 20:
            raise HTTPException(status_code=422, detail="Code too short (min 20 chars)")
        
        return {
            "risk_score": get_weighted_score(), 
            "interpretation": "Sample response"
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)