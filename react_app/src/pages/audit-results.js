import React, { useEffect, useState } from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import { Container, Grid, Paper, Typography, Button, Box, Dialog, DialogActions, DialogContent, DialogTitle} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { auth } from '../components/Authentication';
// axios
import axios from 'axios';

function ResultsPage() {

  const [logoResults, setLogoResults] = useState([]);
  // Define state variables for other categories here

  useEffect(() => {
    // Fetch results for each category separately
    fetchLogoResults();
    // Fetch results for other categories here
  }, []);

  const fetchLogoResults = () => {
    fetch('/get-annotated-images') // Fetch images for the logo category
      .then(response => response.json())
      .then(data => {
        setLogoResults(data.images); // Set the logo detection results received from the backend
      })
      .catch(error => console.error('Error fetching logo results:', error));
  };

  // Define functions to fetch results for other categories here

  const openAnnotatedImageInNewTab = (imageUrl) => {
    window.open(imageUrl, '_blank');
  };

  // page authentication
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    console.log('Current user:', auth.currentUser);
    auth.onAuthStateChanged((currentUser) => {
      console.log('Auth state changed:', currentUser);
      setUser(currentUser);
    });
  }, []);

  //////////////////// 

// items in the database
const [items, setItems] = useState([]);
// pop up when click the item
const [popupItem, setPopupItem] = useState(null);

// fetch data from the database
const fetchResults = async () => {
  try {

      // make request to the backend
      const response = await axios.post('/generate-results');
      // set state of items to the data
      setItems(response.data);
  } catch (error) {
      // errors
      console.error("Error fetching results:", error);
  }
}

// when a box is clicked, we display the item
const handleBoxClick = (item) => {
  // set the clicked item to display in the pop-up
  setPopupItem(item);
}

// close the pop up
const closePopup = () => {
  setPopupItem(null);
}

// fetch results when the user go on page
useEffect(() => {
    fetchResults();
},[]);

// order to display the keys of database results
const keys_order = ['Dealership Name', 'Brand', 'Department', 'Country']

  return (
    <React.Fragment>
      {user ? (
        <React.Fragment>
          <MaterialUI.SideBar />
          <header className="App-header" style={{ marginLeft: 125}}>
        <div className="App">
          <Container maxWidth="lg" style={{ marginTop: '6rem' }}>
          <h1>Results</h1>
        <div>
            <div style={{display: 'flex', backgroundColor: 'rgb(255,255,255)', justifyContent: 'flex-start'}}>
            {/* box for each item */}
            {items.map((item, index) => (
                <Box onClick={() => handleBoxClick(item)} key={index} border={1} margin={1} padding={1} sx={{cursor: 'pointer'}}>
                    {/* display key-value pair */}
                    {keys_order.map(key => (
                    <div key={key} style={{ textAlign: 'left' }}>
                      <strong>{key}:</strong> {item[key]}
                    </div>
                    ))}
                </Box>
            ))}
            </div>

  {/* pop-up box*/}
  <Dialog fullWidth open={popupItem} onClose={closePopup} sx={{ marginLeft: 15, display: 'flex', flexDirection: 'column'}}>
  <DialogTitle>Result</DialogTitle>
  <DialogContent>
    {/* content */}
    {/* logo detection results */}
    <Grid item xs={12}>
      <Paper elevation={3} style={{ padding: '1rem' }}>
        <Typography variant="h5" align="center">Logo Detection</Typography>
        <Grid container spacing={2}>
          {logoResults.map((imageUrl, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper elevation={2} style={{ padding: '0.5rem', position: 'relative' }}>
                <CheckCircleOutlineIcon style={{ position: 'absolute', top: 0, left: 0, color: 'green' }} />
                <Typography variant="h6" align="center">Result {index + 1}</Typography>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '0.5rem' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openAnnotatedImageInNewTab(imageUrl)}
                  >
                    Open Image
                  </Button>
                </div>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Grid>
    </DialogContent>
    <DialogActions>
      {/* close pop-up box */}
      <MaterialUI.CustomButton onClick={closePopup}>Close</MaterialUI.CustomButton>
    </DialogActions>
    </Dialog>
    </div>
          
            {logoResults.length === 0 ? (
              <Typography variant="body1">No annotated images available.</Typography>
            ) : (
              <Grid container spacing={3}>
                {/* Logo Detection Results */}

                {/* Add more Grid items for other categories */}
                {/*
                <Grid item xs={12}>
                  <Paper elevation={3} style={{ padding: '1rem' }}>
                    <Typography variant="h5" align="center">Display Cars</Typography>
                    <Grid container spacing={2}>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Paper elevation={3} style={{ padding: '1rem' }}>
                    <Typography variant="h5" align="center">Parking Spaces</Typography>
                    <Grid container spacing={2}>
                    </Grid>
                  </Paper>
                </Grid>


                <Grid item xs={12}>
                  <Paper elevation={3} style={{ padding: '1rem' }}>
                    <Typography variant="h5" align="center">Hospitality</Typography>
                    <Grid container spacing={2}>
                    </Grid>
                  </Paper>
                </Grid>


                <Grid item xs={12}>
                  <Paper elevation={3} style={{ padding: '1rem' }}>
                    <Typography variant="h5" align="center">Spatial</Typography>
                    <Grid container spacing={2}>
                    </Grid>
                  </Paper>
                </Grid>
                      */}


              </Grid>
            )}
          </Container>
          </div>
          </header>
        </React.Fragment>
      ) : (<p>Not Authorized</p>)}
    </React.Fragment>
  );
}

export default ResultsPage;
