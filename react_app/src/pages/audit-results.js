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

  // items in the database
  const [items, setItems] = useState([]);
  // pop up content
  const [popupContent, setPopupContent] = useState(null);

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

  // close the pop up
  const closePopup = () => {
    setPopupContent(null);
  }

  const getPopupTitle = (type) => {
    switch (type) {
      case 'dealerships':
        return 'Dealerships';
      case 'departments':
        return 'Departments';
      case 'submissions':
        return 'Submissions';
      default:
        return '';
    }
  };

  // handle click on brand name
  const handleBrandClick = (brandName) => {
    const dealerships = Array.from(new Set(items.filter(item => item['Brand'] === brandName)
      .map(item => item['Dealership Name'])));

    console.log("Dealerships", dealerships);
    setPopupContent({ type: 'dealerships', data: dealerships, brandName });
  }

  // handle click on dealership
  const handleDealershipClick = (dealershipName) => {
    const departments = Array.from(new Set(items.filter(item => item['Dealership Name'] === dealershipName && item['Brand'] === popupContent.brandName)
      .map(item => item['Department'])));
    setPopupContent({ type: 'departments', data: departments, brandName: popupContent.brandName, dealershipName });
  }


  // handle click on department
  const handleDepartmentClick = (department) => {
    const submissions = items.filter(item => item['Department'] === department && item['Dealership Name'] === popupContent.dealershipName && item['Brand'] === popupContent.brandName)
      .map(item => item['Submitted']);
    setPopupContent({ type: 'submissions', data: submissions, brandName: popupContent.brandName, dealershipName: popupContent.dealershipName, department });
  }

  const handleSubmissionClick = (submission) => {
    navigate(`/audit/results/${encodeURIComponent(popupContent.brandName)}/${encodeURIComponent(popupContent.dealershipName)}/${encodeURIComponent(popupContent.department)}/${encodeURIComponent(submission)}`);
  };

  // order to display the keys of database results
  const brand_names = ['Audi', 'Honda', 'BMW', 'Ford', 'Chevrolet', 'Lincoln', 'Mercedes', 'Volkswagen']


  // fetch results when the user goes on the page
  useEffect(() => {
    fetchResults();
  }, []);

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
                  {/* Search bar*/}
                  <SearchBar />
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                    {/* Display brand names */}
                    {brand_names.map((brandName, index) => (
                      <Card variant="outlined" onClick={() => handleBrandClick(brandName)} key={index} sx={{ cursor: 'pointer', padding: 1, margin: 1, fontSize: '0.75rem', width: '20%', justifyContent: 'flex-start' }}>
                        <CardContent>
                          <Typography>{brandName}</Typography>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Display popup content */}
                  {popupContent && (
                    <Dialog fullWidth open={true} onClose={closePopup} sx={{ marginLeft: 15, display: 'flex', flexDirection: 'column' }}>
                      <DialogTitle>{getPopupTitle(popupContent.type)}</DialogTitle>
                      <DialogContent>
                        <Typography variant="h6" align="center">File Listing</Typography>
                        <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                          {popupContent.data.map((item, index) => (
                            <Button
                              key={index}
                              variant="outlined"
                              style={{ color: '#000000', borderColor: '#bae38c', marginBottom: '0.5rem' }}
                              fullWidth
                              onClick={() => {
                                if (popupContent.type === 'dealerships') {
                                  handleDealershipClick(item);
                                } else if (popupContent.type === 'departments') {
                                  handleDepartmentClick(item);
                                } else {
                                  handleSubmissionClick(item);
                                }
                              }}

                            >
                              {item}
                            </Button>
                          ))}
                        </Box>
                      </DialogContent>
                      <DialogActions>
                        <MaterialUI.CustomButton onClick={closePopup}>Close</MaterialUI.CustomButton>
                      </DialogActions>
                    </Dialog>
                  )}
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

