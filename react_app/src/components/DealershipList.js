import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
// for dealership table
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';


const DealershipListImport = () => {
  // store user dealerships
  const [dealerships, setDealerships] = useState([]);

  // get the dealerships when user enter page
  useEffect(() => {

    // axios request to get dealerships
    const fetchUserDealerships = async () => {
      try {
        const response = await axios.post('http://localhost:8080/user-dealerships');

        // set dealerships
        setDealerships(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching user dealerships:', error);
      }
    };

    // fetch dealerships
    fetchUserDealerships();
  }, []);

  return (
    <Container component="main" maxWidth="s">
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
            </TableRow>
          </TableHead>
          <TableBody>
            {dealerships.map((dealership, index) => (
              <TableRow key={index}>
                <TableCell>{dealership['UID']}</TableCell>
                <TableCell>{dealership['Dealership Name']}</TableCell>
                <TableCell>{dealership['Brand']}</TableCell>
                <TableCell>{dealership['City']}</TableCell>
                <TableCell>{dealership['State']}</TableCell>
                <TableCell>{dealership['UIO']}</TableCell>
                <TableCell>{dealership['Sales']}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DealershipListImport;