import os
import json
import logging
from typing import Dict, Optional
import google.generativeai as genai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class FoodPredictionService:
    def __init__(self):
        # Set the Google API key
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY environment variable is not set")
        
        # Configure the Gemini API
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-pro')
        logger.info("Gemini API configured successfully")

    def predict_price(self, food_item: str, population_growth: float, years_ahead: int, current_price: float) -> Dict:
        """Predict food prices using Gemini API."""
        # Validate inputs
        validation_error = self._validate_inputs(food_item, population_growth, years_ahead, current_price)
        if validation_error:
            return validation_error

        try:
            # Generate prompt
            prompt = self._generate_prompt(food_item, population_growth, years_ahead, current_price)
            logger.info(f"Generated prompt: {prompt[:200]}...")

            # Make API call using Gemini
            response = self.model.generate_content(prompt)
            
            # Process response
            return self._process_response(response, food_item, population_growth, years_ahead, current_price)

        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}", exc_info=True)
            return self._create_fallback_result(
                food_item, population_growth, years_ahead, current_price, f"Unexpected error: {str(e)}"
            )

    def _validate_inputs(self, food_item: str, population_growth: float, years_ahead: int, current_price: float) -> Optional[Dict]:
        """Validate input parameters."""
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
        """Generate the prompt for Gemini."""
        return f"""
        As a food market analyst expert, predict the future price of {food_item} based on:
        - Current price: ${current_price:,.2f}
        - Annual population growth: {population_growth}%
        - Years ahead: {years_ahead}

        Please provide your response in the following JSON format:
        {{
            "predicted_price": float,
            "confidence": float (0-1),
            "factors": list[str],
            "analysis": str
        }}

        Consider these factors in your analysis:
        1. Population growth impact on food demand
        2. Agricultural and production trends
        3. Supply chain factors
        4. Economic indicators
        5. Food-specific market conditions
        """

    def _process_response(self, response, food_item: str, population_growth: float, years_ahead: int, current_price: float) -> Dict:
        """Process the Gemini response."""
        try:
            content = response.text
            logger.info(f"Received response: {content[:200]}...")

            # Extract JSON from the response
            start_idx = content.find('{')
            end_idx = content.rfind('}') + 1
            if start_idx == -1 or end_idx == 0:
                raise ValueError("No JSON found in response")
            
            json_str = content[start_idx:end_idx]
            data = json.loads(json_str)

            # Validate response structure
            if not all(key in data for key in ["predicted_price", "confidence", "factors", "analysis"]):
                raise ValueError("Missing required fields in response")

            # Create success result
            return {
                "predicted_price": float(data["predicted_price"]),
                "confidence_score": float(data["confidence"]),
                "factors": data["factors"],
                "analysis": data["analysis"]
            }
        except Exception as e:
            logger.warning(f"Response processing failed, using fallback: {str(e)}")
            return self._create_fallback_result(
                food_item,
                population_growth,
                years_ahead,
                current_price,
                f"Response processing failed: {str(e)}"
            )

    def _create_error_result(self, message: str) -> Dict:
        """Create an error result dictionary."""
        return {
            "predicted_price": 0,
            "confidence_score": 0,
            "factors": ["Error"],
            "analysis": message
        }

    def _create_fallback_result(self, food_item: str, population_growth: float, years_ahead: int, current_price: float, reason: str) -> Dict:
        """Create a fallback result with calculated prediction."""
        predicted_price = round(current_price * (1 + (population_growth * years_ahead / 100)), 2)
        return {
            "predicted_price": predicted_price,
            "confidence_score": 0.7,
            "factors": ["Population growth", "Basic market trends"],
            "analysis": f"Fallback calculation for {food_item}: {reason}"
        } 