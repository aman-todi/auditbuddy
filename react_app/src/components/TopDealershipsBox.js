// TopDealershipsBox.jsx
import React, { useState, useEffect } from 'react';
import { Typography, Container, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const TopDealershipsBox = () => {
  const [topDealerships, setTopDealerships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopDealerships = async () => {
      try {
        const response = await axios.get('/get_top_data');
        setTopDealerships(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTopDealerships();
  }, []);

  return (
    <Paper elevation={3} sx={{ padding: '16px', width: '30rem', height: '20rem', margin: '0 auto', overflow: 'hidden' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        Top Dealerships
      </Typography>
      {/* Set a fixed height for TableContainer and enable vertical scrolling */}
      <TableContainer component={Paper} style={{ maxHeight: '15rem', overflowY: 'auto' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>UID</TableCell>
              <TableCell>Dealership Name</TableCell>
              <TableCell>Score</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center"><CircularProgress color="success" /></TableCell>
              </TableRow>
            ) : (
              Array.isArray(topDealerships) && topDealerships.map((dataItem, index) => (
                <TableRow key={index} sx={{ cursor: 'pointer' }}>
                  <TableCell>{dataItem[1][0]}</TableCell>
                  <TableCell>{dataItem[0]}</TableCell>
                  <TableCell>{dataItem[1][1]}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper >
  );
};

export default TopDealershipsBox;
