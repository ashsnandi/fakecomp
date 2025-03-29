# main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import logging
from dotenv import load_dotenv
from .services.prediction_service import PredictionService
from .services.food_prediction_service import FoodPredictionService
from .services.data_service import DataService
from .services.city_model_service import CityModelService
from .services.daily_report_service import DailyReportService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
load_dotenv()

app = FastAPI(title="Alien Simulation API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize existing services
try:
    prediction_service = PredictionService()
    food_prediction_service = FoodPredictionService()
    data_service = DataService()
    # Initialize new services
    city_model_service = CityModelService()
    daily_report_service = DailyReportService(city_model_service)
    logger.info("Services initialized successfully")
except Exception as e:
    logger.error(f"Failed to initialize services: {str(e)}")
    raise

# Existing models and endpoints here...
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

class CityModelRequest(BaseModel):
    city_name: str
    base_population: int
    base_growth_rate: float
    base_price: float

class CityModelResponse(BaseModel):
    city_model: dict

class DailyReportRequest(BaseModel):
    aliens_count: int
    comments: Optional[str] = ""

class DailyReportResponse(BaseModel):
    updated_city_model: dict
    report_doc: str
    auto_fill: dict

@app.post("/city-model", response_model=CityModelResponse)
async def create_city_model(request: CityModelRequest):
    try:
        model = city_model_service.create_base_model(
            city_name=request.city_name,
            base_population=request.base_population,
            base_growth_rate=request.base_growth_rate,
            base_price=request.base_price
        )
        return {"city_model": model}
    except Exception as e:
        logger.error(f"Error creating city model: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/city-model", response_model=CityModelResponse)
async def get_city_model():
    try:
        model = city_model_service.get_city_model()
        return {"city_model": model}
    except Exception as e:
        logger.error(f"Error fetching city model: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/daily-report", response_model=DailyReportResponse)
async def process_daily_report(request: DailyReportRequest):
    try:
        result = daily_report_service.process_daily_report(
            aliens_count=request.aliens_count,
            comments=request.comments
        )
        return result
    except Exception as e:
        logger.error(f"Error processing daily report: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
