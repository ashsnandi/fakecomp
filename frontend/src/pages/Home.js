import React from 'react';
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        my: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 4
      }}>
        <Typography 
          variant="h1" 
          component="h1" 
          gutterBottom 
          align="center"
          sx={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: '#2196f3',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
          }}
        >
          Alien Simulation
        </Typography>

        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            width: '100%', 
            maxWidth: 600,
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate('/housing')}
                sx={{
                  height: '100px',
                  fontSize: '1.2rem',
                  background: 'linear-gradient(45deg, #2196f3 30%, #21CBF3 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976d2 30%, #1CB5E0 90%)',
                  },
                }}
              >
                Housing Predictions
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate('/food')}
                sx={{
                  height: '100px',
                  fontSize: '1.2rem',
                  background: 'linear-gradient(45deg, #4CAF50 30%, #45a049 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #388E3C 30%, #2E7D32 90%)',
                  },
                }}
              >
                Food Predictions
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate('/city-model')}
                sx={{
                  height: '100px',
                  fontSize: '1.2rem',
                  background: 'linear-gradient(45deg, #673ab7 30%, #9575cd 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #512da8 30%, #7e57c2 90%)',
                  },
                }}
              >
                City Models
              </Button>
            </Grid>

            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate('/daily-report')}
                sx={{
                  height: '100px',
                  fontSize: '1.2rem',
                  background: 'linear-gradient(45deg, #ff5722 30%, #ff8a65 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #e64a19 30%, #ff7043 90%)',
                  },
                }}
              >
                Daily Report
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => navigate('/job-market')}
                sx={{
                  height: '100px',
                  fontSize: '1.2rem',
                  background: 'linear-gradient(45deg,rgb(149, 212, 214) 30%,rgb(10, 100, 128) 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg,rgb(25, 172, 230) 30%,rgb(67, 255, 246) 90%)',
                  },
                }}
              >
                Job Market
              </Button>
            </Grid>


          </Grid>
        </Paper>
        <Typography 
          variant="body1" 
          align="center" 
          sx={{ 
            mt: 4,
            color: '#666',
            maxWidth: 600
          }}
        >
          Welcome to the Alien Simulation platform. Use our advanced AI models to predict future housing and food prices based on various factors including population growth, market trends, and economic indicators.
        </Typography>
      </Box>
    </Container>
  );
}

export default Home; 