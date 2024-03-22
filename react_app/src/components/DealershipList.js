import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import AddDealershipImport from '../components/AddDealership';
import HelpIcon from '@mui/icons-material/Help';
import * as MaterialUI from './MaterialUI';
// for dealership table
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
// for pop up
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button} from '@mui/material';


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

export const DealershipListImport = () => {

    // handle user table refresh
    const [refresh, setRefresh] = useState(false);

    const handleRefresh = () => {
      setRefresh(!refresh);
    };

  // store user dealerships list
  const [dealerships, setDealerships] = useState([]);

  // check loading
  const [loading, setLoading] = useState(true);

  // get uio for clicked dealership
  const [uio, setUIO] = useState(null);
  const [originalUIO, setOriginalUIO] = useState(uio);

  // get sales for clicked deapership
  const [sales, setSales] = useState(null);
  const [originalSales, setOriginalSales] = useState(sales);
  
  // get the time
  const [updatedTime, setUpdatedTime] = useState('');

  // see if we are in edit mode
  const [editMode, setEditMode] = useState(false);

  // function to update values of uio/sales
  const updateValues = async (sales, uio, clickedDealership) => {
    try {
      // append to a form the dealership, new sales, and new uio
      // create a form and append this file
    const formData = new FormData();

    // extract information from dealership
    formData.append('uid', clickedDealership['UID']);
    formData.append('new_sales', sales);
    formData.append('new_uio', uio);

    // the new time
    const options = {
      timeZone: 'America/New_York',
    };

    const currentDate = new Date().toLocaleString('en-US', options) + " (EST)";

    formData.append('updated', currentDate);
    // update the time in the pop up
    setUpdatedTime(currentDate);

    const response = await axios.post('http://localhost:8080/dealership-update-values', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
      // once the backend is changed, then we need to update the table immediately
      await fetchUserDealerships(setDealerships, setLoading);

      console.log(response.data)
    } catch (error) {
      console.error('Error updating sales and uio:', error);
    }
  };

  // exit from edit mode for uio
  const handleUpdate = () => {
    setEditMode(false);

    // call to the backend with the dealership information
    updateValues(sales, uio, clickedDealership);
  };

  // handle a deletion
  const handleDelete = () => {

    // call to the backend with dealership information
    deleteDealership(clickedDealership);
  }

  // function to delete a dealership from the list
  const deleteDealership = async (clickedDealership) => {
  try {
    // append to a form the dealership uid
    const formData = new FormData();

    // extract information from dealership
    formData.append('uid', clickedDealership['UID']);
    formData.append('name', clickedDealership['Dealership Name'])

    const response = await axios.post('http://localhost:8080/delete-dealership', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
      // once the backend is changed, then we need to update the table immediately
      await fetchUserDealerships(setDealerships, setLoading);

      // close the pop up
      handlePopup();

      console.log(response.data)
    } catch (error) {
      console.error('Error deleting dealership', error);
    }
  };

  // cancel the edit
  const handleCancelEdit = () => {
    setUIO(originalUIO);
    setSales(originalSales);
    setEditMode(false);
  };
  
  // control the clicked dealership
  const [clickedDealership, setClickedDealership] = useState([]);
  const handleClickedDealership = (dealership) => {
    setClickedDealership(dealership);
    setUIO((dealership['UIO']))
    setSales((dealership['Sales']))
    setUpdatedTime((dealership['Updated']))
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

  // handle search
  const [searchQuery, setSearchQuery] = useState('');

  // handle search
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // filter the dealership off of typed search
  const filteredDealerships = dealerships.filter((dealership) => {

    // all dealership fields
    const searchFields = [
      'UID',
      'Dealership Name',
      'Brand',
      'City',
      'State',
      'Country',
      'UIO',
      'Sales',
      'Updated'
    ];
    // if some of the fields are included, we include those results
    return searchFields.some((field) =>
      String(dealership[field]).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

    // control the pop up for add dealerships
    const [popupDealership, setPopupDealership] = useState(false);
    const handlePopupDealership = () => {
      setPopupDealership(!popupDealership);
    };

  return (
    <Container component="main">
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Dealerships</span>
        <Tooltip disableFocusListener title="List of all dealerships">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
        <span style={{marginLeft: 'auto'}}>
          <MaterialUI.CustomButton onClick={handlePopupDealership}>Add Dealership</MaterialUI.CustomButton>
        </span>
      </Typography>

      {/* search bar */}
      <TextField
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
      />

       {/* dialog for add dealerships */}
       <Dialog open={popupDealership} onClose={handlePopupDealership} fullWidth maxWidth="lg">
          <DialogTitle>Add Dealership</DialogTitle>
          <DialogContent>
            <AddDealershipImport refresh={handleRefresh}/>
          </DialogContent>
          <DialogActions>
            <MaterialUI.CustomButton onClick={handlePopupDealership} color="primary">
              Close
            </MaterialUI.CustomButton>
          </DialogActions>
        </Dialog>

      <TableContainer component={Paper} sx={{ maxHeight: "15rem" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>UID</TableCell>
              <TableCell>Dealership Name</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>City</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Country</TableCell>
              <TableCell>UIO</TableCell>
              <TableCell>Sales</TableCell>
              <TableCell>Updated</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {loading ? (
            <TableRow>
            <TableCell colSpan={8} align="center"><CircularProgress color="success" /></TableCell>
            </TableRow>
            ) : (
                filteredDealerships.map((dealership, index) => (
                <TableRow key={index} sx={{cursor: 'pointer'}} onClick={() => handleClickedDealership(dealership)}>
                  <TableCell>{dealership['UID']}</TableCell>
                  <TableCell>{dealership['Dealership Name']}</TableCell>
                  <TableCell>{dealership['Brand']}</TableCell>
                  <TableCell>{dealership['City']}</TableCell>
                  <TableCell>{dealership['State']}</TableCell>
                  <TableCell>{dealership['Country']}</TableCell>
                  <TableCell>{dealership['UIO']}</TableCell>
                  <TableCell>{dealership['Sales']}</TableCell>
                  <TableCell>{dealership['Updated']}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

       {/* pop up */}
       <Dialog open={popup} onClose={handlePopup}>
       <DialogTitle>{clickedDealership && `${clickedDealership['UID']} ${clickedDealership['Dealership Name']} ${clickedDealership['City']} ${clickedDealership['State']} ${clickedDealership['Country']}`}</DialogTitle>
        <DialogContent sx={{marginBotton: '5rem'}}>

        <TextField
          label="Units of Operation"
          value={uio}
          onChange={(e) => setUIO(e.target.value)}
          disabled={!editMode}
        />

        <TextField
          label="Last Year Sales"
          value={sales}
          onChange={(e) => setSales(e.target.value)}
          disabled={!editMode}
        />

        {/* the buttons to control edit/cancel/update */}
        <div>
           {!editMode && (
           <div>
           <MaterialUI.CustomButton onClick={() => {setEditMode(true); setOriginalUIO(uio); setOriginalSales(sales)}}>
              Edit
           </MaterialUI.CustomButton>
           </div>
           )}
          {editMode && (
          <div>
            <MaterialUI.CustomButton onClick={handleUpdate}>Update</MaterialUI.CustomButton>
            <MaterialUI.CustomButton onClick={handleCancelEdit}>Cancel</MaterialUI.CustomButton>
          </div>
          )}
          </div>

          {/* last time uid and uio was updated */}
          <Typography>Last Updated</Typography>
          <Typography>{updatedTime}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleDelete}>Delete Dealership</Button>
          <MaterialUI.CustomButton onClick={handlePopup}>Close</MaterialUI.CustomButton>
        </DialogActions>
      </Dialog>
    </Container>
  );
};