import os
import json
import logging
from typing import Dict
import google.generativeai as genai
from google.api_core import exceptions as google_exceptions

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        # Load API key from environment variable
        self.api_key = os.getenv("GOOGLE_API_KEY")
        if not self.api_key:
            raise ValueError("GOOGLE_API_KEY environment variable not set")
        
        # Configure Gemini API
        genai.configure(api_key=self.api_key)
        
        # Initialize model with safety settings
        self.model = genai.GenerativeModel(
            'gemini-1.5-flash',
            safety_settings=[
                {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
                {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"}
            ]
        )
        logger.info("Gemini model initialized successfully")

    def predict_price(self, current_price: float, population_growth: float, years_ahead: int) -> Dict:
        """Predict housing prices using Gemini API."""
        try:
            prompt = self._generate_prompt(current_price, population_growth, years_ahead)
            logger.info(f"Sending prompt to Gemini: {prompt[:200]}...")
            
            # Generate content with timeout
            response = self.model.generate_content(
                prompt,
                generation_config={
                    "max_output_tokens": 1000,
                    "temperature": 0.5
                }
            )
            
            return self._process_response(response, current_price, population_growth, years_ahead)
            
        except google_exceptions.GoogleAPIError as e:
            logger.error(f"Google API error: {str(e)}")
            return self._create_fallback_result(
                current_price, population_growth, years_ahead, f"API error: {str(e)}"
            )
        except Exception as e:
            logger.error(f"Prediction failed: {str(e)}")
            return self._create_fallback_result(
                current_price, population_growth, years_ahead, str(e)
            )

    def _generate_prompt(self, current_price: float, population_growth: float, years_ahead: int) -> str:
        """Generate the prompt for Gemini."""
        return f"""
        As a real estate expert, predict the home price in {years_ahead} years based on:
        - Current price: ${current_price:,.2f}
        - Annual population growth: {population_growth}%
        
        Respond ONLY with this exact JSON format between ```json markers:
        ```json
        {{
            "predicted_price": 0.0,
            "confidence": 0.0,
            "key_factors": ["factor1", "factor2"],
            "analysis": "Your professional analysis here"
        }}
        ```
        
        Considerations:
        1. Population growth impact on demand
        2. Historical price trends
        3. Current market conditions
        4. Economic indicators
        """

    def _process_response(self, response, current_price: float, population_growth: float, years_ahead: int) -> Dict:
        """Process Gemini response and extract JSON."""
        try:
            content = response.text
            
            # Extract JSON from markdown code block if present
            if '```json' in content:
                content = content.split('```json')[1].split('```')[0].strip()
            
            data = json.loads(content)
            
            # Validate response structure
            required_keys = ["predicted_price", "confidence", "key_factors", "analysis"]
            if not all(key in data for key in required_keys):
                raise ValueError(f"Missing required keys. Got: {list(data.keys())}")
            
            return {
                "status": "success",
                "predicted_price": float(data["predicted_price"]),
                "confidence_score": float(data["confidence"]),
                "factors": data["key_factors"],
                "analysis": data["analysis"],
                "current_price": current_price,
                "population_growth": population_growth,
                "years_ahead": years_ahead
            }
            
        except Exception as e:
            logger.error(f"Failed to process response: {str(e)}\nRaw response: {content}")
            raise

    def _create_fallback_result(self, current_price: float, population_growth: float, years_ahead: int, reason: str) -> Dict:
        """Create fallback prediction when API fails."""
        predicted_price = round(current_price * (1 + (population_growth * years_ahead / 100)), 2)
        return {
            "status": "fallback",
            "predicted_price": predicted_price,
            "confidence_score": 0.7,
            "factors": ["Population growth"],
            "analysis": f"Fallback calculation: {reason}",
            "current_price": current_price,
            "population_growth": population_growth,
            "years_ahead": years_ahead
        }

# Test function
if __name__ == "__main__":
    # Set test environment variable
    os.environ["GOOGLE_API_KEY"] = "your_test_key_here"
    
    try:
        service = PredictionService()
        result = service.predict_price(
            current_price=350000,
            population_growth=2.5,
            years_ahead=5
        )
        print("Test Prediction Result:")
        print(json.dumps(result, indent=2))
    except Exception as e:
        print(f"Test failed: {str(e)}")