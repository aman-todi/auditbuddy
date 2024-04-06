// TopDealershipsBox.jsx
import React, { useState, useEffect } from 'react';
import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, useTheme, useMediaQuery} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

const TopDealershipsBox = () => {

  // for mobile responsiveness
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Paper sx={{ padding: '1rem', width: isMobile ? '100vw' : '30vw', height: '45vh', maxHeight: '45vh'}}>
      <Typography gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#74b42c' }}>
        Top Dealerships
      </Typography>
      {/* Set a fixed height for TableContainer and enable vertical scrolling */}
      <TableContainer component={Paper} style={{ height: '35vh', maxHeight: '35vh', overflowY: 'auto' }}>
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
                <TableRow key={index}>
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
