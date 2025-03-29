// src/pages/DailyReport.js

import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// A local bank of random advice. You can expand this as you like!
const RANDOM_ARTICLE_SNIPPETS = [
  (aliens) => `We have detected a surge of ${aliens} new alien arrivals. City council recommends building advanced dwellings.`,
  (aliens) => `${aliens} aliens in one day! Consider allocating more farmland for intergalactic crop varieties.`,
  (aliens) => `Reports indicate ${aliens} off-world visitors. It's time to budget for new energy infrastructure and possibly universal translator devices.`,
  (aliens) => `Alien count of ${aliens} means we might face population density challenges. Let's explore vertical housing solutions.`,
  () => `We also propose investing in interstellar tourism to boost local economy.`,
  () => `Local scientists suggest improving warp-train lines for comfortable alien transportation.`,
  () => `Environmental factors: we must ensure a clean energy supply if we want to remain a top alien-friendly city.`,
];

const API_URL = 'http://localhost:8000';

function DailyReport() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    aliens_count: '',
    comments: '',
  });
  const [reportResult, setReportResult] = useState(null);
  const [error, setError] = useState('');

  // Generate a random article from our snippet bank
  const generateRandomArticle = (aliensCount) => {
    // Pick 2-4 random snippets
    const snippetCount = Math.floor(Math.random() * 3) + 2; 
    const chosen = [];
    for (let i = 0; i < snippetCount; i++) {
      const snippetFunc =
        RANDOM_ARTICLE_SNIPPETS[
          Math.floor(Math.random() * RANDOM_ARTICLE_SNIPPETS.length)
        ];
      chosen.push(snippetFunc(aliensCount));
    }
    return chosen.join(' ');
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setError('');
    try {
      // 1) Post daily report to your backend
      const res = await axios.post(`${API_URL}/daily-report`, {
        aliens_count: parseInt(formData.aliens_count),
        comments: formData.comments,
      });

      // 2) Use the server’s data as normal
      const serverData = res.data;

      // 3) Create a local "article" ignoring the server's AI field
      const localArticle = generateRandomArticle(formData.aliens_count);

      // 4) Merge that into our final "reportResult" object
      setReportResult({
        ...serverData,
        random_article: localArticle,
      });
    } catch (err) {
      setError('Failed to process daily report');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Daily Report (Random Article Demo)
        </Typography>
        <Paper sx={{ p: 4 }}>
          <form onSubmit={handleSubmitReport}>
            <TextField
              fullWidth
              label="Aliens Count"
              name="aliens_count"
              type="number"
              value={formData.aliens_count}
              onChange={handleChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Comments"
              name="comments"
              multiline
              rows={3}
              value={formData.comments}
              onChange={handleChange}
              margin="normal"
            />
            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              <Button variant="outlined" onClick={() => navigate('/')}>
                Back to Home
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Submit Daily Report
              </Button>
            </Box>
          </form>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Paper>

        {/* Display results, including random article */}
        {reportResult && (
          <Box sx={{ mt: 4 }}>
            <Paper sx={{ p: 3, backgroundColor: '#f9f9f9' }}>
              <Typography variant="h6" gutterBottom>
                📋 Full Daily Report
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {reportResult.report_doc}
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Small Recommendations
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {reportResult.random_article}
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                🚀 Autofill Data for Prediction Pages
              </Typography>
              <pre>{JSON.stringify(reportResult.auto_fill, null, 2)}</pre>
            </Paper>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default DailyReport;
