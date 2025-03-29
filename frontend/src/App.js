
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Home from './pages/Home';
import HousingPrediction from './pages/HousingPrediction';
import FoodPrediction from './pages/FoodPrediction';
import CityModels from './pages/CityModels';
import DailyReport from './pages/DailyReport';
import JobMarket from './pages/JobMarket';
import { CityDataContext } from './CityDataContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#4CAF50',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/job-market" element={<JobMarket />} />
        <Route path="/" element={<Home />} />
        <Route path="/housing" element={<HousingPrediction />} />
        <Route path="/food" element={<FoodPrediction />} />
        <Route path="/city-model" element={<CityModels />} />
        <Route path="/daily-report" element={<DailyReport />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;