import pandas as pd
import numpy as np
from typing import Dict, List

class FoodDataService:
    def __init__(self):
        # Sample food-related historical data
        self.sample_data = {
            "years": list(range(2010, 2024)),
            "prices": [
                10, 12, 14, 15, 16, 18, 20, 22, 24, 26, 28, 30, 32, 35
            ],
            "demand": [
                1000, 1050, 1100, 1150, 1200, 1250, 1300, 1350, 1400, 1450, 1500, 1550, 1600, 1650
            ]
        }

    def get_historical_data(self) -> Dict:
        """
        Return historical food price and demand data
        """
        return self.sample_data

    def calculate_demand_growth_rate(self) -> float:
        """
        Calculate the average annual demand growth rate
        """
        demand = self.sample_data["demand"]
        years = len(demand) - 1
        growth_rate = ((demand[-1] / demand[0]) ** (1 / years) - 1) * 100
        return round(growth_rate, 2)

    def get_price_trend(self) -> Dict:
        """
        Calculate price trend statistics for food
        """
        prices = self.sample_data["prices"]
        return {
            "average_price": round(np.mean(prices), 2),
            "price_growth_rate": round(((prices[-1] / prices[0]) ** (1 / (len(prices) - 1)) - 1) * 100, 2),
            "min_price": min(prices),
            "max_price": max(prices)
        }