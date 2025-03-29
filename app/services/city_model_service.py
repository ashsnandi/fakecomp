# services/city_model_service.py
import logging

logger = logging.getLogger(__name__)

class CityModelService:
    def __init__(self):
        # Initialize without a model until one is created
        self.city_model = None

    def create_base_model(self, city_name: str, base_population: int, base_growth_rate: float, base_price: float):
        """Create a base city model and calculate derived stats."""
        self.city_model = {
            "city_name": city_name,
            "base_population": base_population,
            "base_growth_rate": base_growth_rate,
            "base_price": base_price,
            "derived_stats": self.calculate_derived_stats(base_population, base_growth_rate, base_price)
        }
        logger.info(f"Created base city model: {self.city_model}")
        return self.city_model

    def calculate_derived_stats(self, population: int, growth_rate: float, price: float):
        """Calculate example derived statistics from the base model.
           (E.g., a 10‐year projection.)"""
        years = 10
        projected_population = int(population * ((1 + growth_rate/100) ** years))
        projected_price = round(price * (1 + growth_rate/100 * years), 2)
        return {
            "projected_population_10_years": projected_population,
            "projected_price_10_years": projected_price
        }

    def update_model_with_daily_report(self, aliens_count: int, comments: str):
        """Update the city model based on daily report data.
           For example, assume each alien increases growth rate by 0.1%."""
        if not self.city_model:
            raise ValueError("City model has not been created yet.")

        additional_growth = aliens_count * 0.1
        updated_growth_rate = self.city_model["base_growth_rate"] + additional_growth

        # Update the model and re-calculate derived statistics.
        self.city_model["base_growth_rate"] = updated_growth_rate
        self.city_model["derived_stats"] = self.calculate_derived_stats(
            self.city_model["base_population"],
            updated_growth_rate,
            self.city_model["base_price"]
        )

        # Generate pointers based on aliens count and extra comments.
        pointers = []
        if aliens_count > 5:
            pointers.append("High alien activity detected—review city security protocols.")
        else:
            pointers.append("Alien activity is within normal range.")

        if comments:
            pointers.append(f"Additional comment: {comments}")

        return self.city_model, pointers

    def get_city_model(self):
        """Return the current city model."""
        if not self.city_model:
            raise ValueError("City model has not been created yet.")
        return self.city_model
