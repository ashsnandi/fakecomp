import os
import json
import logging
from typing import Dict, Optional
import openai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FoodPredictionService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        openai.api_key = api_key
        logger.info("OpenAI API configured successfully")

    def predict_price(self, food_item: str, population_growth: float, years_ahead: int, current_price: float) -> Dict:
        validation_error = self._validate_inputs(food_item, population_growth, years_ahead, current_price)
        if validation_error:
            return validation_error

        try:
            prompt = self._generate_prompt(food_item, population_growth, years_ahead, current_price)
            logger.info(f"Sending prompt to OpenAI...")

            response = openai.ChatCompletion.create(
                model="gpt-4",  # or "gpt-3.5-turbo"
                messages=[
                    {"role": "system", "content": "You are a food economics analyst."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )

            content = response.choices[0].message['content']
            logger.info(f"Received response: {content[:200]}...")

            return self._process_response(content, food_item, population_growth, years_ahead, current_price)

        except Exception as e:
            logger.error(f"OpenAI request failed: {str(e)}", exc_info=True)
            return self._create_fallback_result(
                food_item, population_growth, years_ahead, current_price,
                f"OpenAI error: {str(e)}"
            )

    def _validate_inputs(self, food_item: str, population_growth: float, years_ahead: int, current_price: float) -> Optional[Dict]:
        if not food_item:
            return self._create_error_result("Food item is required")
        if not all(isinstance(x, (int, float)) for x in [population_growth, years_ahead, current_price]):
            return self._create_error_result("All numeric parameters must be numbers")
        if current_price <= 0:
            return self._create_error_result("Current price must be positive")
        if years_ahead <= 0:
            return self._create_error_result("Prediction years must be positive")
        return None

    def _generate_prompt(self, food_item: str, population_growth: float, years_ahead: int, current_price: float) -> str:
        return f"""
Predict the future price of {food_item} in {years_ahead} years given:
- Current price: ${current_price:.2f}
- Annual population growth: {population_growth}%

Return a response in **strict JSON format** like this:
{{
    "predicted_price": float,
    "confidence": float (0 to 1),
    "factors": [string, ...],
    "analysis": string
}}

Consider:
- Demand due to population growth
- Agricultural trends
- Supply chain disruptions
- Economic conditions
- Market seasonality
"""

    def _process_response(self, content: str, food_item: str, population_growth: float, years_ahead: int, current_price: float) -> Dict:
        try:
            start = content.find('{')
            end = content.rfind('}') + 1
            json_str = content[start:end]
            data = json.loads(json_str)

            if not all(key in data for key in ["predicted_price", "confidence", "factors", "analysis"]):
                raise ValueError("Missing required fields in AI response")

            return {
                "predicted_price": float(data["predicted_price"]),
                "confidence_score": float(data["confidence"]),
                "factors": data["factors"],
                "analysis": data["analysis"]
            }
        except Exception as e:
            logger.warning(f"Failed to parse OpenAI response: {str(e)}")
            return self._create_fallback_result(
                food_item, population_growth, years_ahead, current_price,
                f"Response parsing failed: {str(e)}"
            )

    def _create_error_result(self, message: str) -> Dict:
        return {
            "predicted_price": 0,
            "confidence_score": 0,
            "factors": ["Error"],
            "analysis": message
        }

    def _create_fallback_result(self, food_item: str, population_growth: float, years_ahead: int, current_price: float, reason: str) -> Dict:
        predicted_price = round(current_price * (1 + (population_growth * years_ahead / 100)), 2)
        return {
            "predicted_price": predicted_price,
            "confidence_score": 0.7,
            "factors": ["Population growth", "Basic market trends"],
            "analysis": f"Fallback prediction for {food_item}: {reason}"
        }
