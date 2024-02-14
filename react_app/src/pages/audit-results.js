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
    navigate(`/audit/results/${encodeURIComponent(item["Brand"])}/${encodeURIComponent(item["Dealership Name"])}`);
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
                    <DialogTitle>{popupItem} Results</DialogTitle>
                    <DialogContent>
                      <Typography variant="h6" align="center">File Listing</Typography>
                      <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                        {items.reduce((uniqueNames, item) => {
                          if (item['Brand'] === popupItem && !uniqueNames.includes(item['Dealership Name'])) {
                            uniqueNames.push(item);
                          }
                          return uniqueNames;
                        }, []).map((item, index) => (
                          <Button
                            key={index}
                            variant="outlined"
                            style={{ color: '#000000', borderColor: '#bae38c', marginBottom: '0.5rem' }} // Use hexadecimal value for colors
                            fullWidth
                            onClick={() => handleFileListingClick(item)}
                          >
                            {item["Dealership Name"]}
                          </Button>
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