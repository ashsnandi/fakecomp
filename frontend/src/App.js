import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function App() {
  const [historicalData, setHistoricalData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    current_price: '',
    population_growth: '',
    years_ahead: '',
  });

  useEffect(() => {
    fetchHistoricalData();
  }, []);

  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get(`${API_URL}/historical-data`);
      setHistoricalData(response.data);
    } catch (err) {
      setError('Failed to fetch historical data');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/predict`, {
        current_price: parseFloat(formData.current_price),
        population_growth: parseFloat(formData.population_growth),
        years_ahead: parseInt(formData.years_ahead),
      });
      setPrediction(response.data);
    } catch (err) {
      setError('Failed to get prediction');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Housing Price Prediction
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Historical Data
              </Typography>
              {historicalData && (
                <LineChart
                  width={500}
                  height={300}
                  data={historicalData.years.map((year, index) => ({
                    year,
                    price: historicalData.prices[index],
                    population: historicalData.population[index],
                  }))}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="price"
                    stroke="#8884d8"
                    name="Price"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="population"
                    stroke="#82ca9d"
                    name="Population"
                  />
                </LineChart>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h5" gutterBottom>
                Make a Prediction
              </Typography>
              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Current Price"
                  name="current_price"
                  type="number"
                  value={formData.current_price}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Population Growth Rate (%)"
                  name="population_growth"
                  type="number"
                  value={formData.population_growth}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <TextField
                  fullWidth
                  label="Years Ahead"
                  name="years_ahead"
                  type="number"
                  value={formData.years_ahead}
                  onChange={handleChange}
                  margin="normal"
                  required
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ mt: 2 }}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Predict'}
                </Button>
              </form>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {prediction && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Prediction Results
                  </Typography>
                  <Typography>
                    Predicted Price: ${prediction.predicted_price.toLocaleString()}
                  </Typography>
                  <Typography>
                    Confidence Score: {(prediction.confidence_score * 100).toFixed(1)}%
                  </Typography>
                  <Typography variant="subtitle1" sx={{ mt: 2 }}>
                    Key Factors:
                  </Typography>
                  <ul>
                    {prediction.factors.map((factor, index) => (
                      <li key={index}>{factor}</li>
                    ))}
                  </ul>
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Analysis: {prediction.analysis}
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App; 