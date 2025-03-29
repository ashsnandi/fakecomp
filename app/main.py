from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from .services.prediction_service import PredictionService
from .services.food_prediction_service import FoodPredictionService
from .services.data_service import DataService
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

app = FastAPI(title="Alien Simulation API")

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
    food_prediction_service = FoodPredictionService()
    data_service = DataService()
    logger.info("Services initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize services: {str(e)}")
    raise

class PredictionRequest(BaseModel):
    population_growth: float
    years_ahead: int
    current_price: float

class FoodPredictionRequest(PredictionRequest):
    food_item: str

class PredictionResponse(BaseModel):
    predicted_price: float
    confidence_score: float
    factors: List[str]
    analysis: str

@app.get("/")
async def root():
    return {"message": "Welcome to Alien Simulation API"}

@app.get("/api/housing/historical-data")
async def get_housing_historical_data():
    """
    Endpoint to fetch historical housing data
    """
    try:
        return data_service.get_historical_data()
    except Exception as e:
        logger.error(f"Error fetching housing historical data: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to fetch housing historical data")

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
        return prediction
    except Exception as e:
        logger.error(f"Error in predict_price endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/predict-food", response_model=PredictionResponse)
async def predict_food_price(request: FoodPredictionRequest):
    try:
        logger.info(f"Received food prediction request: {request}")
        prediction = food_prediction_service.predict_price(
            food_item=request.food_item,
            population_growth=request.population_growth,
            years_ahead=request.years_ahead,
            current_price=request.current_price
        )
        logger.info(f"Generated food prediction: {prediction}")
        return prediction
    except Exception as e:
        logger.error(f"Error in predict_food_price endpoint: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}