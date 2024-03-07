import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import * as MaterialUI from './MaterialUI';
// for dealership table
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
// for pop up
import { Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';


 // axios request to get dealerships
 export const fetchUserDealerships = async (setDealerships, setLoading) => {
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

export const DealershipListImport = ({refresh}) => {
  // store user dealerships list
  const [dealerships, setDealerships] = useState([]);
  // check loading
  const [loading, setLoading] = useState(true);
  
  // control the clicked dealership
  const [clickedDealership, setClickedDealership] = useState([]);
  const handleClickedDealership = (dealership) => {
    setClickedDealership(dealership);
    setPopup(true);
  };

  // control the pop up
  const [popup, setPopup] = useState(false);
  const handlePopup = () => {
    setPopup(false);
  };

  // get the dealerships when user enter page
  useEffect(() => {

    // fetch dealerships
    fetchUserDealerships(setDealerships, setLoading);
  }, [refresh]);

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
                <TableRow key={index} sx={{cursor: 'pointer'}} onClick={() => handleClickedDealership(dealership)}>
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
          </TableBody>
        </Table>
      </TableContainer>

       {/* pop up */}
       <Dialog open={popup} onClose={handlePopup}>
       <DialogTitle>{clickedDealership && `${clickedDealership['UID']} ${clickedDealership['Dealership Name']} ${clickedDealership['City']} ${clickedDealership['State']} ${clickedDealership['Country']}`}</DialogTitle>
        <DialogContent>
          {/* uio update */}
          <Typography>Units of Operation</Typography>
          <Typography>{clickedDealership['UIO']}</Typography>
          <MaterialUI.CustomButton>Update</MaterialUI.CustomButton>

          {/* sales update */}
          <Typography>Last Year Sales</Typography>
          <Typography>{clickedDealership['Sales']}</Typography>
          <MaterialUI.CustomButton>Update</MaterialUI.CustomButton>

          {/* last time uid and uio was updated */}
          <Typography>Last Updated</Typography>
          <Typography>{clickedDealership['Updated']}</Typography>
        </DialogContent>
        <DialogActions>
          <MaterialUI.CustomButton onClick={handlePopup}>Close</MaterialUI.CustomButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};