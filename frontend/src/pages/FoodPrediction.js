import React, { useState } from 'react';
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

// Hardcoded historical data (no API calls)
const sampleHistoricalData = {
  years: [2010, 2011, 2012, 2013, 2014, 2015],
  prices: [10, 12, 14, 16, 17, 20],
  demand: [100, 120, 130, 150, 160, 180],
};

function FoodPrediction() {
  const historicalData = sampleHistoricalData;

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    item: '',
    quantity: '',
    location: '',
    season: '',
    currentPrice: '',
    populationGrowth: '',
    yearsAhead: '',
  });

  // Called on form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Local "prediction" approach
    try {
      const currentPrice = parseFloat(formData.currentPrice) || 1;
      const growth = parseFloat(formData.populationGrowth) || 0;
      const years = parseInt(formData.yearsAhead) || 1;

      // Basic formula
      const predictedPrice = currentPrice * Math.pow(1 + growth / 100, years);
      const confidenceScore = 0.8; // placeholder
      const analysis = `Purely local calculation: Price = currentPrice * (1 + growth%)^years.`;

      // Build a "factors" array from user inputs
      const factors = [
        `Quantity: ${formData.quantity}`,
        `Location: ${formData.location}`,
        `Season: ${formData.season}`,
        `Population Growth: ${growth}%`,
      ];

      setPrediction({
        predicted_price: predictedPrice,
        confidence_score: confidenceScore,
        factors,
        analysis,
      });
    } catch (err) {
      setError('Failed to run local prediction');
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
        {/* Policy Considerations Panel (Front & Center) */}
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Food Price Policy Considerations
          </Typography>

          <Typography variant="body1" paragraph>
            We can mitigate inflationary pressures on food by <b>rationing</b> the amount of food
            that each household can consume.
          </Typography>
          <Typography variant="body1" paragraph>
            While rationing, we can also attempt to <b>increase the supply of food</b> in our city
            by importing from surrounding cities.
          </Typography>
          <Typography variant="body1" paragraph>
            We can invest more into our farmers by introducing <b>new subsidies</b> for producing
            a certain amount for every harvest.
          </Typography>
          <Typography variant="body1" paragraph>
            An objection to these subsidies is that they could disproportionately
            <b> benefit large farms</b> while disadvantaging smaller farms.
          </Typography>
        </Paper>

        <Grid container spacing={3}>
          {/* Historical Data Chart */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Historical Data
              </Typography>
              {historicalData ? (
                <LineChart
                  width={500}
                  height={300}
                  data={historicalData.years.map((year, idx) => ({
                    year,
                    price: historicalData.prices[idx],
                    demand: historicalData.demand[idx],
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
                    name="Supply"
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

          {/* Prediction Form & Output */}
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 4 }}>
              <Typography variant="h5" gutterBottom>
                Make a Prediction
              </Typography>
              <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
                    label="Quantity (units)"
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
                  <TextField
                    required
                    label="Current Price"
                    name="currentPrice"
                    type="number"
                    value={formData.currentPrice}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    required
                    label="Population Growth (%)"
                    name="populationGrowth"
                    type="number"
                    value={formData.populationGrowth}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    required
                    label="Years Ahead"
                    name="yearsAhead"
                    type="number"
                    value={formData.yearsAhead}
                    onChange={handleChange}
                    fullWidth
                  />

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      onClick={() => window.history.back()}
                      disabled={loading}
                    >
                      Back
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
                      ${prediction.predicted_price.toLocaleString(undefined, {
                        maximumFractionDigits: 2,
                      })}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
                      Confidence Score: {(prediction.confidence_score * 100).toFixed(1)}%
                    </Typography>
                  </Paper>

                  <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Key Factors
                    </Typography>
                    <List>
                      {prediction.factors.map((factor, idx) => (
                        <ListItem key={idx}>
                          <ListItemText primary={factor} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>

                  <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Analysis
                    </Typography>
                    <Typography variant="body1">{prediction.analysis}</Typography>
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
