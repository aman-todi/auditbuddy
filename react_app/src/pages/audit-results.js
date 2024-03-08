import React, { useEffect, useState } from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import { Container, Grid, Paper, Typography, Button, Select, Tabs, Tab, MenuItem, CardHeader, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent, FormControl, Box, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import { auth } from '../components/Authentication';
import { SearchBar } from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
// axios
import axios from 'axios';

function ResultsPage() {

  // navigate to another page
  const navigate = useNavigate();

  // page authentication
  const [user, setUser] = useState(auth.currentUser);
  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
  }, []);

  // for mobile responsiveness
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // fetch data from the database
  const fetchResults = async () => {
    try {
      // make request to the backend
      const response = await axios.post('/generate-results');
      // set state of items to the data
      setItems(response.data);
      // show that the items are finished loading
      setLoading(false);

    } catch (error) {
      // errors
      console.error("Error fetching results:", error);
    }
  }
  // fetch results when the user goes on the page
  useEffect(() => {
    fetchResults();
  }, []);

  // order to display the keys of database results
  const brand_names = ['Audi', 'BMW', 'Chevrolet', 'Ford', 'Honda','Lincoln', 'Mercedes', 'Volkswagen']

  // items in the database
  const [items, setItems] = useState([]);
  // loading indicator of the results
  const [loading, setLoading] = useState(true);

  // pop up content
  const [popupContent, setPopupContent] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [clickedBrandName, setClickedBrandName] = useState(null);

  // close the pop up
  const closePopup = () => {
    setIsPopupOpen(false);

    // if the popup is closed, re-click the brand button if its name was clicked previously
    if (clickedBrandName) {
      handleBrandClick(clickedBrandName);
    }
  }
  // open the pop up
  const openPopup = (content) => {
    setPopupContent(content);
    setIsPopupOpen(true);
  };

  // Search Bar Results
  const [searchResults, setSearchResults] = useState([]);

  // handle search functionality
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
      openPopup({ type: 'Submitted', other: 'Search', data: results });
      console.log("Popup set!");
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };


  // clicking of brand cards
  const handleBrandClick = (brandName) => {

     // set clicked brand name
     setClickedBrandName(brandName);

    // Filter items based on the selected brand
    const dealerships = items.filter(item => item['Brand'] === brandName);

    // Track unique dealership names
    const uniqueDealerships = new Set();

    // Filter items using UID
    const uniqueFilteredDealerships = dealerships.filter(item => {
      if (!uniqueDealerships.has(item['UID'])) {
        uniqueDealerships.add(item['UID']);
        return true;
      }
      return false;
    });

    // Set the popup content with unique filtered dealerships
    setPopupContent({ type: 'Dealership Name', data: uniqueFilteredDealerships, name: brandName });
  }

  // handle click on dealership
  const handleDealershipClick = (param) => {
    const departments = Array.from(new Set(items.filter(item => item['Dealership Name'] === param['Dealership Name'] && item['Brand'] === param['Brand'] && item['UID'] === param['UID'])));

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

    // after clicking dealership, display the uid and dealership name as title in pop up
    openPopup({ type: 'Department', data: uniqueFilteredDepartments, name: param["UID"] + ' - ' + param["Dealership Name"] });
  }

  // handle click on department
  const handleDepartmentClick = (param) => {
    const submissions = items.filter(item => item['Department'] === param['Department'] && item['Dealership Name'] === param['Dealership Name'] && item['Brand'] === param['Brand'] && param['UID'] === item["UID"]);
    openPopup({ type: 'Submitted', data: submissions, name: param["Department"] });
  }

  const handleSubmissionClick = (param) => {
    navigate(`/audit/results/${encodeURIComponent(param['Brand'])}/${encodeURIComponent(param['Dealership Name'])}/${encodeURIComponent(param['Department'])}/${encodeURIComponent(param["Submitted"])}`);
  };

  return (
    <React.Fragment>
      {user ? (
        <React.Fragment>
          <MaterialUI.SideBar />
          <header className="App-header" style={{ marginLeft: isMobile ? 0 : 125 }}>
            <div className="App">
              <Container maxWidth="lg" style={{ marginTop: '6rem' }}>
                <h1>Results</h1>
                <div>
                  {/* Search bar*/}
                  <SearchBar onSearch={handleSearch} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10vh' }}>

                  {/* Display brand name cards */}
                  {loading ? (
                    <CircularProgress color="success" />
                  ) : (
                    <>
                    <div>
                      <Typography>
                        {clickedBrandName ? "" : "Select a brand to view"}
                      </Typography>
                      <div style={{ display: 'flex', flexDirection: 'row' }}>
                        {brand_names.map((brandName, index) => (
                      <div 
                        key={index} 
                        onClick={() => handleBrandClick(brandName)} 
                        style={{ 
                          border: brandName === clickedBrandName ? '0.1em solid green' : '0.1em solid black',
                          padding: '0.5em',
                          margin: '0.1em',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        {brandName}
                  </div>
                ))}
                </div>
              </div>
              </>
              )}
            </div>
            {/* handle pop up content accordingly */}
            <div style={{ marginLeft: 15, display: 'flex', flexDirection: 'column' }}>
              {/* handle the dealership list for each brand */}
              {popupContent && popupContent.type === 'Dealership Name' ? (
            <div>
            <div>
            <Typography variant="h6">{popupContent.name}</Typography>
            </div>
            <div>
            <Typography variant="h6" align="center">File Listing</Typography>
            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
              {popupContent.data.map((item, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  style={{ color: '#000000', borderColor: '#bae38c', marginBottom: '0.5rem' }}
                  fullWidth
                  onClick={() => handleDealershipClick(item)}
                >
                  {`${item['UID']} - ${item['Dealership Name']}`}
                </Button>
              ))}
            </Box>
          </div>
        </div>
      ) : (
        // handle the other pop ups like department and submission
        popupContent && (
          <Dialog fullWidth open={isPopupOpen} onClose={closePopup} sx={{ marginLeft: 15, display: 'flex', flexDirection: 'column' }}>
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
                      if (popupContent.type === 'Department') {
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
              <Button onClick={closePopup}>Close</Button>
            </DialogActions>
          </Dialog>
        )
      )}
    </div>
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

