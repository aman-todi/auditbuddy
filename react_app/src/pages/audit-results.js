import React, { useEffect, useState } from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import { Container, Grid, Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent, FormControl, Box } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { auth } from '../components/Authentication';
import { SearchBar } from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
// axios
import axios from 'axios';

function ResultsPage() {
  const navigate = useNavigate();

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
  }, []);

  const handleFileListingClick = (item) => {
    // Navigate to separate page with the listing data
    navigate(`/audit/results/${item['Dealership Name']}`);
  };

  // order to display the keys of database results
  const brand_names = ['Audi', 'Honda', 'BMW', 'Ford', 'Chevrolet', 'Lincoln', 'Mercedes', 'GM']

  return (
    <React.Fragment>
      {user ? (
        <React.Fragment>
          <MaterialUI.SideBar />
          <header className="App-header" style={{ marginLeft: 125 }}>
            <div className="App">
              <Container maxWidth="lg" style={{ marginTop: '6rem' }}>
                <h1>Results</h1>
                <div>
                  {/* search bar*/}
                  <SearchBar></SearchBar>

                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {brand_names.map((brandName, index) => (
                      <Card variant="outlined" onClick={() => handleBoxClick(brandName)} key={index} sx={{ cursor: 'pointer', padding: 1, margin: 1, fontSize: '0.75rem', width: '20%', justifyContent: 'flex-start' }}>
                        <CardContent>
                          <Typography>{brandName}</Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* pop-up box*/}
                  <Dialog fullWidth open={popupItem} onClose={closePopup} sx={{ marginLeft: 15, display: 'flex', flexDirection: 'column' }}>
                    <DialogTitle> {popupItem} Results</DialogTitle>
                    <DialogContent>
                      <Typography variant="h6" align="center">File Listing</Typography>
                      <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                        {items.map((item, index) => (
                          // Render a button for each past audit matching the selected brand
                          item['Brand'] === popupItem && (
                            <Button
                              key={index}
                              variant="outlined"
                              style={{ color: '#000000', borderColor: '#bae38c', marginBottom: '0.5rem' }} // Use hexadecimal value for black color
                              fullWidth
                              onClick={() => handleFileListingClick(item)}
                            >
                              {item['Dealership Name']}
                            </Button>
                          )
                        ))}
                      </Box>
                    </DialogContent>
                    <DialogActions>
                      {/* close pop-up box */}
                      <MaterialUI.CustomButton onClick={closePopup}>Close</MaterialUI.CustomButton>
                    </DialogActions>
                  </Dialog>
                </div>

              </Container>
            </div>
          </header>
        </React.Fragment>
      ) : (<p>Not Authorized</p>)}
    </React.Fragment>
  );
}

export default ResultsPage;
