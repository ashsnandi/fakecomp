import pandas as pd
import numpy as np
from typing import Dict, List
import os

class DataService:
    def __init__(self):
        # In a real application, this would load from a database or external API
        self.sample_data = {
            "years": list(range(2010, 2024)),
            "prices": [
                200000, 210000, 220000, 230000, 240000, 250000,
                260000, 270000, 280000, 290000, 300000, 310000,
                320000, 330000
            ],
            "population": [
                100000, 102000, 104000, 106000, 108000, 110000,
                112000, 114000, 116000, 118000, 120000, 122000,
                124000, 126000
            ]
        }
    
    def get_historical_data(self) -> Dict:
        """
        Return historical housing price and population data
        """
        return self.sample_data
    
    def calculate_population_growth_rate(self) -> float:
        """
        Calculate the average annual population growth rate
        """
        population = self.sample_data["population"]
        years = len(population) - 1
        growth_rate = ((population[-1] / population[0]) ** (1/years) - 1) * 100
        return round(growth_rate, 2)
    
    def get_price_trend(self) -> Dict:
        """
        Calculate price trend statistics
        """
        prices = self.sample_data["prices"]
        return {
            "average_price": round(np.mean(prices), 2),
            "price_growth_rate": round(((prices[-1] / prices[0]) ** (1/(len(prices)-1)) - 1) * 100, 2),
            "min_price": min(prices),
            "max_price": max(prices)
        } 