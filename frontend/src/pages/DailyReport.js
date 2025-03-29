import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = 'http://localhost:8000';

function DailyReport() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    aliens_count: '',
    comments: '',
  });
  const [reportResult, setReportResult] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${API_URL}/daily-report`, {
        aliens_count: parseInt(formData.aliens_count),
        comments: formData.comments,
      });
      setReportResult(response.data);
    } catch (err) {
      setError('Failed to process daily report');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Daily Report
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
                🧠 Infrastructure Advice from AI
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {reportResult.infrastructure_advice}
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                🚀 Autofill Data for Prediction Pages
              </Typography>
              <Typography variant="subtitle1">Housing:</Typography>
              <pre>{JSON.stringify(reportResult.auto_fill.housing, null, 2)}</pre>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1">Food:</Typography>
              <pre>{JSON.stringify(reportResult.auto_fill.food, null, 2)}</pre>
            </Paper>
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default DailyReport;