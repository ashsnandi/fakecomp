from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from .services.prediction_service import PredictionService
from .services.data_service import DataService
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(title="Housing Price Prediction API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize services
try:
    prediction_service = PredictionService()
    data_service = DataService()
    logger.info("Services initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize services: {str(e)}")
    raise

class PredictionRequest(BaseModel):
    population_growth: float
    years_ahead: int
    current_price: float

class PredictionResponse(BaseModel):
    predicted_price: float
    confidence_score: float
    factors: List[str]
    analysis: str

@app.get("/")
async def root():
    return {"message": "Welcome to Housing Price Prediction API"}

@app.get("/historical-data")
async def get_historical_data():
    try:
        return data_service.get_historical_data()
    except Exception as e:
        logger.error(f"Error getting historical data: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict", response_model=PredictionResponse)
async def predict_price(request: PredictionRequest):
    try:
        logger.info(f"Received prediction request: {request}")
        prediction = prediction_service.predict_price(
            population_growth=request.population_growth,
            years_ahead=request.years_ahead,
            current_price=request.current_price
        )
        logger.info(f"Generated prediction: {prediction}")
        
        # Ensure the response matches the expected format
        return {
            "predicted_price": prediction["predicted_price"],
            "confidence_score": prediction["confidence_score"],
            "factors": prediction["factors"],
            "analysis": prediction["analysis"]
        }
    except Exception as e:
        logger.error(f"Error in predict_price endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"} 