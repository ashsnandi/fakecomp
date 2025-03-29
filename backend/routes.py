from flask import Flask, request, jsonify
from flask_cors import CORS
from .services.food_data_service import FoodDataService
from .services.housing_data_service import HousingDataService

app = Flask(__name__)
CORS(app)

food_service = FoodDataService()
housing_service = HousingDataService()

@app.route('/api/food/historical-data', methods=['GET'])
def get_food_historical_data():
    return jsonify(food_service.get_historical_data())

@app.route('/api/food/predict', methods=['POST'])
def predict_food_prices():
    data = request.get_json()
    return jsonify(food_service.predict_prices(
        current_price=data['current_price'],
        inflation_rate=data['inflation_rate'],
        years_ahead=data['years_ahead']
    ))

@app.route('/api/housing/historical-data', methods=['GET'])
def get_housing_historical_data():
    return jsonify(housing_service.get_historical_data())

@app.route('/api/housing/predict', methods=['POST'])
def predict_housing_prices():
    data = request.get_json()
    return jsonify(housing_service.predict_prices(
        current_price=data['current_price'],
        population_growth=data['population_growth'],
        years_ahead=data['years_ahead']
    ))

if __name__ == '__main__':
    app.run(debug=True, port=8000) 