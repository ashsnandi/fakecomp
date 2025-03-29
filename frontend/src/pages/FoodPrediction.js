import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function FoodPrediction() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    item: '',
    quantity: '',
    location: '',
    season: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [prediction, setPrediction] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setPrediction(null);

    try {
      const response = await axios.post('http://localhost:5000/api/predict/food', formData);
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while making the prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Food Price Prediction
        </Typography>

        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
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
            <Paper elevation={2} sx={{ p: 3, mt: 3, bgcolor: '#f5f5f5' }}>
              <Typography variant="h6" gutterBottom>
                Prediction Result
              </Typography>
              <Typography variant="h4" color="primary">
                ${prediction.predictedPrice.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Estimated food price based on the provided information
              </Typography>
            </Paper>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default FoodPrediction; 