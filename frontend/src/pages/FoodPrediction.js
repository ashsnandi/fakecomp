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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function FoodPrediction() {
  const navigate = useNavigate();
  const [historicalData, setHistoricalData] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    item: '',
    quantity: '',
    location: '',
    season: '',
  });

  useEffect(() => {
    fetchHistoricalData();
  }, []);

  const fetchHistoricalData = async () => {
    try {
      const response = await axios.get(`${API_URL}/food-historical-data`);
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
      const response = await axios.post(`${API_URL}/predict-food`, formData);
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
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Food Price Prediction
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Historical Data
              </Typography>
              {historicalData ? (
                <LineChart
                  width={500}
                  height={300}
                  data={historicalData.years.map((year, index) => ({
                    year,
                    price: historicalData.prices[index],
                    demand: historicalData.demand[index],
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
                    stroke="#FF9800"
                    name="Price"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="demand"
                    stroke="#82ca9d"
                    name="Demand"
                  />
                </LineChart>
              ) : (
                <Typography>Loading historical data...</Typography>
              )}
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Make a Prediction
              </Typography>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  <TextField
                    required
                    label="Food Item"
                    name="item"
                    value={formData.item}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    required
                    label="Quantity (in units)"
                    name="quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    required
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    required
                    label="Season"
                    name="season"
                    value={formData.season}
                    onChange={handleChange}
                    fullWidth
                  />

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/')}
                      disabled={loading}
                    >
                      Back to Home
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      disabled={loading}
                      sx={{ minWidth: 150 }}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Get Prediction'}
                    </Button>
                  </Box>
                </Box>
              </form>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              {prediction && (
                <Box sx={{ mt: 3 }}>
                  <Paper elevation={2} sx={{ p: 3, bgcolor: '#f5f5f5' }}>
                    <Typography variant="h6" gutterBottom>
                      Prediction Result
                    </Typography>
                    <Typography variant="h4" color="primary">
                      ${prediction.predictedPrice.toLocaleString()}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                      Confidence Score: {(prediction.confidence * 100).toFixed(1)}%
                    </Typography>
                  </Paper>

                  <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Key Factors
                    </Typography>
                    <List>
                      {prediction.factors.map((factor, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={factor} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>

                  <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Analysis
                    </Typography>
                    <Typography variant="body1">
                      {prediction.analysis}
                    </Typography>
                  </Paper>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default FoodPrediction;