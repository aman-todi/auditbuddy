import React, { useState, useEffect, useRef } from 'react';
import { Typography, Paper, Box } from '@mui/material';
import axios from 'axios';
import Chart from 'chart.js/auto';

const DashboardGraph = ({ clickedResult, type }) => {
  const [graphData, setGraphData] = useState(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response;
        // Check the type and make the appropriate axios call
        if (type === 'dealership') {
          response = await axios.get(`/get_dealership_data?dealership=${clickedResult}`);
        } else if (type === 'brand') {
          response = await axios.get(`/get_brand_data?brand=${clickedResult}`);
        }
        // Process response data and set the graph data
        setGraphData(response.data);
      } catch (error) {
        console.error('Error fetching graph data:', error);
      }
    };

    if (clickedResult) {
      fetchData();
    }
  }, [clickedResult, type]);

  useEffect(() => {
    // Create and update the chart when graphData changes
    if (graphData) {
      renderChart();
    }
  }, [graphData]);

  const renderChart = () => {
    // Check if chart instance already exists and destroy it
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Extract data for chart
    const labels = Object.keys(graphData);
    const totalScores = labels.map(label => graphData[label].total_score);
    const averageScores = labels.map(label => graphData[label].average_score);

    // Create the chart
    const ctx = document.getElementById('dashboardChart');
    if (ctx) {
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Total Score',
            data: type === 'brand' ? totalScores : averageScores,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }, {
            label: 'Average Score',
            data: type === 'brand' ? averageScores : totalScores,
            borderColor: 'rgb(192, 75, 192)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ width: '70%', p: 2, marginBottom: '2rem' }}>
        <Typography variant="h6" gutterBottom align="center">
          Dashboard Graph
        </Typography>
        {/* Render the chart canvas */}
        <canvas id="dashboardChart" width="400" height="150"></canvas>
      </Paper>
    </Box>
  );
};

export default DashboardGraph;
