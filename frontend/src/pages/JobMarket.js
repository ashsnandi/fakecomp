// src/pages/JobMarket.js
import React from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Grid,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// -------------- 1) Sample data for Alien Influx Over Time --------------
const alienInfluxData = [
  { month: 'Jan', aliensArrived: 50 },
  { month: 'Feb', aliensArrived: 80 },
  { month: 'Mar', aliensArrived: 120 },
  { month: 'Apr', aliensArrived: 90 },
  { month: 'May', aliensArrived: 140 },
  { month: 'Jun', aliensArrived: 200 },
];

// -------------- 2) Sample data for Job Demand by Sector --------------
const sectorDemandData = [
  { sector: 'Agriculture', jobs: 40 },
  { sector: 'Engineering', jobs: 100 },
  { sector: 'Healthcare', jobs: 70 },
  { sector: 'Security', jobs: 30 },
  { sector: 'Administration', jobs: 60 },
];

// -------------- 3) Sample data for Resource Allocation --------------
const resourceAllocationData = [
  { name: 'Housing', value: 400 },
  { name: 'Alien Integration', value: 300 },
  { name: 'Infrastructure', value: 200 },
  { name: 'Healthcare', value: 100 },
];

// Some random colors for the pie chart slices
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function JobMarket() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Current Job Market & Alien Influx
        </Typography>

        <Grid container spacing={4}>
          {/* Alien Influx Over Time (LineChart) */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Alien Influx Over Time
              </Typography>
              <LineChart
                width={400}
                height={300}
                data={alienInfluxData}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="aliensArrived" stroke="#8884d8" name="Aliens" />
              </LineChart>
            </Paper>
          </Grid>

          {/* Job Demand by Sector (BarChart) */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Job Demand by Sector
              </Typography>
              <BarChart
                width={400}
                height={300}
                data={sectorDemandData}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sector" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="jobs" fill="#82ca9d" name="Jobs Needed" />
              </BarChart>
            </Paper>
          </Grid>

          {/* Resource Allocation (PieChart) */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Resource Allocation
              </Typography>
              <PieChart width={400} height={300}>
                <Pie
                  data={resourceAllocationData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {resourceAllocationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </Paper>
          </Grid>

          {/* Explanation / Recommendations */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Recommendations
              </Typography>
              <Typography variant="body1" paragraph>
                Based on the alien influx, we recommend increasing job training programs
                in technical and medical fields. Agricultural expansion may be necessary
                if the influx continues at its current pace. 
              </Typography>
              <Typography variant="body1" paragraph>
                The bar chart shows which sectors have the highest demand, so resources should
                be allocated accordingly to fill the gap. Meanwhile, the pie chart indicates our
                current resource distribution. Consider shifting more funds to 
                “Alien Integration” if arrivals spike.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default JobMarket;
