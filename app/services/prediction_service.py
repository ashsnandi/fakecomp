import os
import json
import logging
from typing import Dict
import openai

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PredictionService:
    def __init__(self):
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise ValueError("OPENAI_API_KEY not found in environment variables")
        openai.api_key = api_key
        logger.info("OpenAI API configured successfully.")

    def predict_price(self, population_growth: float, years_ahead: int, current_price: float) -> Dict:
        try:
            prompt = self._generate_prompt(population_growth, years_ahead, current_price)
            logger.info(f"Sending prompt to OpenAI...")

            response = openai.ChatCompletion.create(
                model="gpt-4",  # or "gpt-3.5-turbo"
                messages=[
                    {"role": "system", "content": "You are a real estate economics assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.5,
                max_tokens=500
            )

            content = response.choices[0].message['content']
            logger.info(f"Raw OpenAI response: {content[:200]}...")

            return self._process_response(content, population_growth, years_ahead, current_price)

        except Exception as e:
            logger.error(f"OpenAI API call failed: {str(e)}", exc_info=True)
            return self._create_fallback_result(
                population_growth, years_ahead, current_price,
                f"OpenAI error: {str(e)}"
            )

    def _generate_prompt(self, population_growth: float, years_ahead: int, current_price: float) -> str:
        return f"""
You are a housing market forecasting AI.

Based on:
- Current housing price: ${current_price:.2f}
- Annual population growth: {population_growth}%
- Timeframe: {years_ahead} years

Predict the future housing price and provide analysis.

Respond in strict JSON format like this:
{{
  "predicted_price": float,
  "confidence": float (0 to 1),
  "factors": [string, ...],
  "analysis": string
}}

Factors may include supply & demand, population dynamics, economic trends, etc.
"""

    def _process_response(self, content: str, population_growth: float, years_ahead: int, current_price: float) -> Dict:
        try:
            start = content.find('{')
            end = content.rfind('}') + 1
            json_str = content[start:end]
            data = json.loads(json_str)

            if not all(key in data for key in ["predicted_price", "confidence", "factors", "analysis"]):
                raise ValueError("Missing fields in OpenAI response")

            return {
                "predicted_price": float(data["predicted_price"]),
                "confidence_score": float(data["confidence"]),
                "factors": data["factors"],
                "analysis": data["analysis"]
            }
        except Exception as e:
            logger.warning(f"Failed to parse OpenAI response: {str(e)}")
            return self._create_fallback_result(
                population_growth, years_ahead, current_price,
                f"Response parsing failed: {str(e)}"
            )

    def _create_fallback_result(self, population_growth: float, years_ahead: int, current_price: float, reason: str) -> Dict:
        predicted_price = round(current_price * (1 + (population_growth * years_ahead / 100)), 2)
        return {
            "predicted_price": predicted_price,
            "confidence_score": 0.7,
            "factors": ["Population growth"],
            "analysis": f"Fallback calculation: {reason}"
        }
