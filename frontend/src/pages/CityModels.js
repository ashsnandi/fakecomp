
import React, { useState } from 'react';
import { Container, Box, Typography, TextField, Button, Paper, Alert } from '@mui/material';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function CityModels() {
  const [formData, setFormData] = useState({
    city_name: '',
    base_population: '',
    base_growth_rate: '',
    base_price: '',
  });
  const [cityModel, setCityModel] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateModel = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${API_URL}/city-model`, {
        city_name: formData.city_name,
        base_population: parseInt(formData.base_population),
        base_growth_rate: parseFloat(formData.base_growth_rate),
        base_price: parseFloat(formData.base_price),
      });
      setCityModel(response.data.city_model);
    } catch (err) {
      setError('Failed to create city model');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          City Models
        </Typography>
        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleCreateModel}>
            <TextField
              fullWidth
              label="City Name"
              name="city_name"
              value={formData.city_name}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Base Population"
              name="base_population"
              type="number"
              value={formData.base_population}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Base Growth Rate (%)"
              name="base_growth_rate"
              type="number"
              value={formData.base_growth_rate}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Base Price"
              name="base_price"
              type="number"
              value={formData.base_price}
              onChange={handleChange}
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
              Create City Model
            </Button>
          </form>
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
          {cityModel && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6">City Model Details:</Typography>
              <pre>{JSON.stringify(cityModel, null, 2)}</pre>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}

export default CityModels;
