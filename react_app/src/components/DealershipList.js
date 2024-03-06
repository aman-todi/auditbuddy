import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
// for dealership table
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';


const DealershipListImport = () => {
  // store user dealerships
  const [dealerships, setDealerships] = useState([]);
  // check loading
  const [loading, setLoading] = useState(true);

  // get the dealerships when user enter page
  useEffect(() => {

    // axios request to get dealerships
    const fetchUserDealerships = async () => {
      try {
        const response = await axios.post('http://localhost:8080/user-dealerships');

        // set dealerships
        setDealerships(response.data);
        setLoading(false);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching user dealerships:', error);
      }
    };

    // fetch dealerships
    fetchUserDealerships();
  }, []);

  return (
    <Container component="main">
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Dealership List</span>
        <Tooltip disableFocusListener title="List of all dealerships">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: "15rem" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>UID</TableCell>
              <TableCell>Dealership Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>UIO</TableCell>
              <TableCell>Sales</TableCell>
              <TableCell>Country</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {loading ? (
            <TableRow>
            <TableCell colSpan={8} align="center"><CircularProgress color="success" /></TableCell>
            </TableRow>
            ) : (
                dealerships.map((dealership, index) => (
                <TableRow key={index}>
                  <TableCell>{dealership['UID']}</TableCell>
                  <TableCell>{dealership['Dealership Name']}</TableCell>
                  <TableCell>{dealership['Brand']}</TableCell>
                  <TableCell>{dealership['City']}</TableCell>
                  <TableCell>{dealership['State']}</TableCell>
                  <TableCell>{dealership['UIO']}</TableCell>
                  <TableCell>{dealership['Sales']}</TableCell>
                  <TableCell>{dealership['Country']}</TableCell>
                </TableRow>
              ))
            )}
            {/* {dealerships.map((dealership, index) => (
              <TableRow key={index}>
                <TableCell>{dealership['UID']}</TableCell>
                <TableCell>{dealership['Dealership Name']}</TableCell>
                <TableCell>{dealership['Brand']}</TableCell>
                <TableCell>{dealership['City']}</TableCell>
                <TableCell>{dealership['State']}</TableCell>
                <TableCell>{dealership['UIO']}</TableCell>
                <TableCell>{dealership['Sales']}</TableCell>
                <TableCell>{dealership['Country']}</TableCell>
              </TableRow>
            ))} */}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DealershipListImport;