import os
import google.generativeai as genai
from google.api_core import exceptions as google_exceptions  # For error handling
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        # Load the Google API key from the environment variable
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            raise ValueError("GOOGLE_API_KEY not found in environment variables")
        
        # Configure the Generative AI client
        genai.configure(api_key=api_key)
        logger.info("Google Generative AI configured successfully.")

        # Define safety settings
        self.safety_settings = [
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_LOW_AND_ABOVE",
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_LOW_AND_ABOVE",
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_LOW_AND_ABOVE",
            },
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_LOW_AND_ABOVE",
            },
        ]

        # Set up the model
        self.model = "gemini-1.5-flash"  # Replace with the correct model name
        logger.info(f"Using model: {self.model}")

    def predict_price(self, population_growth: float, years_ahead: int, current_price: float):
        """Predict housing prices using Google Generative AI."""
        try:
            # Generate the prompt
            prompt = self._generate_prompt(population_growth, years_ahead, current_price)
            logger.info(f"Generated prompt: {prompt[:200]}...")

            # Call the Generative AI API
            response = genai.generate_text(
                model=self.model,
                prompt=prompt,
                safety_settings=self.safety_settings,
                max_output_tokens=1000,
                temperature=0.5
            )
            logger.info(f"Raw response from Generative AI: {response}")

            # Process the response
            return self._process_response(response, population_growth, years_ahead, current_price)

        except google_exceptions.GoogleAPICallError as e:
            logger.error(f"Google API call error: {str(e)}")
            return self._create_fallback_result(
                population_growth, years_ahead, current_price, f"Google API call error: {str(e)}"
            )
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}", exc_info=True)
            return self._create_fallback_result(
                population_growth, years_ahead, current_price, f"Unexpected error: {str(e)}"
            )

    def _generate_prompt(self, population_growth: float, years_ahead: int, current_price: float) -> str:
        """Generate the prompt for the Generative AI model."""
        return f"""
        You are a real estate market analyst. Predict the housing price in {years_ahead} years based on:
        - Current price: ${current_price:,.2f}
        - Annual population growth rate: {population_growth}%

        Provide your response in EXACTLY this JSON format:
        {{
            "predicted_price": 0.0,
            "confidence": 0.0,
            "factors": ["factor1", "factor2"],
            "analysis": "Your analysis here"
        }}
        """

    def _process_response(self, response, population_growth: float, years_ahead: int, current_price: float):
        """Process the response from the Generative AI model."""
        try:
            content = response.result  # Adjust based on the actual response structure
            logger.info(f"Processing response content: {content[:200]}...")

            # Parse the JSON response
            data = json.loads(content)

            # Validate response structure
            if not all(key in data for key in ["predicted_price", "confidence", "factors", "analysis"]):
                raise ValueError("Missing required fields in response")

            return {
                "predicted_price": float(data["predicted_price"]),
                "confidence_score": float(data["confidence"]),
                "factors": data["factors"],
                "analysis": data["analysis"]
            }
        except Exception as e:
            logger.warning(f"Response processing failed: {str(e)}")
            return self._create_fallback_result(
                population_growth, years_ahead, current_price, f"Response processing failed: {str(e)}"
            )

    def _create_fallback_result(self, population_growth: float, years_ahead: int, current_price: float, reason: str):
        """Create a fallback result with a simple calculation."""
        predicted_price = round(current_price * (1 + (population_growth * years_ahead / 100)), 2)
        return {
            "predicted_price": predicted_price,
            "confidence_score": 0.7,
            "factors": ["Population growth"],
            "analysis": f"Fallback calculation: {reason}"
        }