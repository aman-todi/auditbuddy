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

  // Search Bar Results
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (criteria) => {
    try {
      // Make a request to the backend with search criteria
      console.log("Handling Searchs");
      const response = await axios.post('/search-results', criteria);
      // Log the response data
      console.log("Search results:", response);
      // Set search results in state
      setSearchResults(response.data);
      console.log("Length of Search", response.data.length);

      const results = response.data;
      // Set the popup content to display the search results
      setPopupContent({ type: 'Submitted', other: 'Search', data: results });
      console.log("Popup set!");
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };



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


  const handleBrandClick = (brandName) => {
    // Filter items based on the selected brand
    const dealerships = items.filter(item => item['Brand'] === brandName);

    // Track unique dealership names
    const uniqueDealerships = new Set();

    // Filter items for unique dealership names
    const uniqueFilteredDealerships = dealerships.filter(item => {
      if (!uniqueDealerships.has(item['Dealership Name'])) {
        uniqueDealerships.add(item['Dealership Name']);
        return true;
      }
      return false;
    });

    // Set the popup content with unique filtered dealerships
    setPopupContent({ type: 'Dealership Name', data: uniqueFilteredDealerships, name: brandName });
  }


  // handle click on dealership
  const handleDealershipClick = (param) => {
    const departments = Array.from(new Set(items.filter(item => item['Dealership Name'] === param['Dealership Name'] && item['Brand'] === param['Brand'])));

    // Track unique dealership names
    const uniqueDepartments = new Set();

    // Filter items for unique dealership names
    const uniqueFilteredDepartments = departments.filter(item => {
      if (!uniqueDepartments.has(item['Department'])) {
        uniqueDepartments.add(item['Department']);
        return true;
      }
      return false;
    });

    setPopupContent({ type: 'Department', data: uniqueFilteredDepartments, name: param["Dealership Name"] });
  }

  // handle click on department
  const handleDepartmentClick = (param) => {
    const submissions = items.filter(item => item['Department'] === param['Department'] && item['Dealership Name'] === param['Dealership Name'] && item['Brand'] === param['Brand']);
    setPopupContent({ type: 'Submitted', data: submissions, name: param["Department"] });
  }

  const handleSubmissionClick = (param) => {
    navigate(`/audit/results/${encodeURIComponent(param['Brand'])}/${encodeURIComponent(param['Dealership Name'])}/${encodeURIComponent(param['Department'])}/${encodeURIComponent(param["Submitted"])}`);
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
                  <SearchBar onSearch={handleSearch} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10vh' }}>
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
                      <DialogTitle>{popupContent.name}</DialogTitle>
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
                                if (popupContent.type === 'Dealership Name') {
                                  handleDealershipClick(item);
                                } else if (popupContent.type === 'Department') {
                                  handleDepartmentClick(item);
                                } else {
                                  handleSubmissionClick(item);
                                }
                              }}
                            >
                              {item[popupContent.type]}
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
        </React.Fragment >
      ) : (<p>Not Authorized</p>)
      }
    </React.Fragment >
  );
}

export default ResultsPage;

