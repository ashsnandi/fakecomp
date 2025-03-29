# services/daily_report_service.py
import logging
import openai  
import os

logger = logging.getLogger(__name__)

class DailyReportService:
    def __init__(self, city_model_service):
        self.city_model_service = city_model_service
        self.openai_api_key = os.getenv("OPENAI_API_KEY")
        if not self.openai_api_key:
            raise ValueError("OPENAI_API_KEY environment variable is not set")
        openai.api_key = self.openai_api_key

    def process_daily_report(self, aliens_count: int, comments: str):
        """
        Process the daily report:
          - Update the city model.
          - Generate a report document with pointers.
          - Provide auto-fill suggestions for other prediction pages.
          - Use OpenAI to generate infrastructure advice.
        """
        try:
            updated_model, pointers = self.city_model_service.update_model_with_daily_report(aliens_count, comments)
            auto_fill = {
                "housing": {
                    "current_price": updated_model["base_price"],
                    "population_growth": updated_model["base_growth_rate"],
                    "years_ahead": 10
                },
                "food": {
                    "food_item": "Alien Cuisine Special",  # Example placeholder
                    "current_price": round(updated_model["base_price"] * 0.5, 2),
                    "population_growth": updated_model["base_growth_rate"],
                    "years_ahead": 10
                }
            }

            # 🧠 Generate AI Infrastructure Advice
            advice = self._generate_infrastructure_advice(aliens_count, comments, updated_model)

            report_doc = (
                f"Daily Report:\n"
                f"Aliens Count: {aliens_count}\n"
                f"Comments: {comments}\n\n"
                f"Pointers:\n" + "\n".join(pointers) + "\n\n"
                f"Infrastructure Advice:\n{advice}"
            )

            return {
                "updated_city_model": updated_model,
                "report_doc": report_doc,
                "auto_fill": auto_fill,
                "infrastructure_advice": advice
            }

        except Exception as e:
            logger.error(f"Error processing daily report: {str(e)}", exc_info=True)
            raise

    def _generate_infrastructure_advice(self, aliens_count, comments, model):
        """Call OpenAI to generate infrastructure advice."""
        try:
            prompt = (
                """As a futuristic city planner AI, you are monitoring a city named {model['city_name']}.\n",
                f"The current base population is {model['base_population']} with a growth rate of {model['base_growth_rate']}%.\n"
                f"The base housing price is ${model['base_price']:.2f}.\n"
                f"{aliens_count} aliens arrived today.\n"f34
                f"Additional notes: {comments}\n\n"
                f"Given this, provide infrastructure recommendations for the next 10 years.\n"
                f"Focus on housing, energy, transportation, and any alien-specific needs."""
            )

            logger.info("Sending prompt to OpenAI...")
            logger.debug(prompt)

            response = openai.ChatCompletion.create(
                model="gpt-",
                messages=[
                    {"role": "system", "content": "You are a city infrastructure advisor AI."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=500
            )

            return response.choices[0].message['content'].strip()

        except Exception as e:
            logger.error(f"OpenAI infrastructure advice failed: {e}", exc_info=True)
            return "Could not generate 12312AI-based infrastructure advice due to an error."
