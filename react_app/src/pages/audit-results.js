import React, { useEffect, useState } from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import { Container, Grid, Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Box, useTheme, useMediaQuery, CircularProgress, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { auth } from '../components/Authentication';
import { SearchBar } from '../components/SearchBar';
import { useNavigate } from 'react-router-dom';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// axios
import axios from 'axios';

function ResultsPage() {

  // navigate to another page
  const navigate = useNavigate();

  // hold the submissions count for each brand
  const [dealershipCount, setDealershipCount] = useState(new Map());

  // order to display the keys of database results
  const brand_names = ['Audi', 'BMW', 'Cadillac', 'Chevrolet', 'Ford', 'Honda', 'Kia', 'Nissan', 'Porsche', 'Subaru', 'Toyota', 'Volkswagen']

  // page authentication
  const [user, setUser] = useState(auth.currentUser);
  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });
  }, []);

  // filter dealterships by uid
  function filterUniqueDealerships(submissions) {
    // Track unique dealership names
    const uniqueDealerships = new Set();

    // Filter items using UID
    const uniqueFilteredDealerships = submissions.filter(item => {
      if (!uniqueDealerships.has(item['UID'])) {
        uniqueDealerships.add(item['UID']);
        return true;
      }
      return false;
    });

    return uniqueFilteredDealerships;
  }




  // fetch data from the database
  // fetch data from the database
  const fetchResults = async () => {
    try {
      // create a form and append this file
      const formData = new FormData();

      // Listen for changes in user authentication state
      auth.onAuthStateChanged((currentUser) => {
        // Update the user state when authentication state changes
        setUser(currentUser);

        // Check if a user is logged in
        if (currentUser) {
          const email = currentUser.email;
          // Append the user's email to the form data
          formData.append('email', email);

          console.log("user", currentUser); // Log the user
        } else {
          console.log("No user logged in");
        }

        // Make the request to the backend after user state is updated
        axios.post('/generate-results', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          // Handle response
          // set state of items to the data
          setItems(response.data);

          // filter dealerships and remove duplicates
          const uniqueFilteredDealerships = filterUniqueDealerships(response.data);

          // get the count of how many dealerships are available for each brand
          const newDealershipCount = new Map();
          uniqueFilteredDealerships.forEach(submission => {
            const brandName = submission['Brand'];
            newDealershipCount.set(brandName, (newDealershipCount.get(brandName) || 0) + 1);
          });

          setDealershipCount(newDealershipCount);
        }).catch(error => {
          // Handle error
          console.error("Error fetching results:", error);
        }).finally(() => {
          // Show that the items are finished loading
          setLoading(false);
        });
      });
    } catch (error) {
      // Handle error
      console.error("Error fetching results:", error);
    }
  };

  // Fetch results when the user goes on the page
  useEffect(() => {
    fetchResults();
  }, []);

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
      openPopup({ type: 'Upload Name', other: 'Search', data: results });
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

    // filter dealerships by removing duplicates
    const uniqueFilteredDealerships = filterUniqueDealerships(dealerships);

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
    openPopup({ type: 'Upload Name', data: submissions, name: param["Department"] });
  }

  const handleSubmissionClick = (param) => {
    // Store parameters in session storage
    sessionStorage.setItem('advancedResultsParams', JSON.stringify(param));
    // Navigate to the advanced results page
    navigate('/audit/results/advanced-results');
  };

  // for mobile responsiveness
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <React.Fragment>
      {user ? (
        <React.Fragment>
          <header className="App-header">
            <div className="App">
              <Container maxWidth="lg" fullWidth style={{ marginTop: '6rem', maxWidth: '90vw' }}>
                <h1>Results</h1>
                <div>

                  {/* render the search bar differently on mobile */}
                  {isMobile ? (
                    <Accordion>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <h2>Search</h2>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '10vh', overflowX: 'auto' }}>
                          <SearchBar onSearch={handleSearch} />
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  ) : (
                    /* Search bar */
                    <SearchBar onSearch={handleSearch} />
                  )}

                  <Container fullWidth style={{ overflowX: 'auto', marginTop: '5rem' }}>
                    {loading ? (
                      <CircularProgress color="success" />
                    ) : (
                      <>
                        <div>
                          <div style={{ display: 'flex', flexDirection: 'row' }}>
                            {brand_names.map((brandName, index) => (
                              <div
                                key={index}
                                onClick={() => handleBrandClick(brandName)}
                                style={{
                                  backgroundColor: brandName === clickedBrandName ? '#bae38c' : 'rgb(245,245,245)',
                                  padding: '0.5em',
                                  margin: '0.1em',
                                  cursor: 'pointer',
                                  textAlign: 'center'
                                }}
                              >
                                {brandName} {dealershipCount.get(brandName) || 0}
                              </div>
                            ))}
                          </div>
                          <Typography sx={{ marginTop: clickedBrandName ? '0' : '5rem' }}>
                            {clickedBrandName ? "" : "Select a brand to view"}
                          </Typography>
                        </div>
                      </>
                    )}
                  </Container>

                  {/* handle pop up content accordingly */}
                  <div style={{ marginLeft: 15, display: 'flex', flexDirection: 'column' }}>
                    {/* handle the dealership list for each brand */}
                    {popupContent && popupContent.type === 'Dealership Name' ? (
                      <div>
                        <div>
                          <Typography variant="h6">{popupContent.name}</Typography>
                        </div>
                        <div>
                          <Box sx={{ maxHeight: '10%', overflowY: 'auto' }}>
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
                        <Dialog fullWidth open={isPopupOpen} onClose={closePopup} sx={{ display: 'flex', flexDirection: 'column' }}>
                          <DialogTitle>{popupContent.name}</DialogTitle>
                          <DialogContent>
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

