import React, { useEffect, useState } from 'react';
import * as MaterialUI from '../components/MaterialUI';
import { useParams } from 'react-router-dom';
import { Container, Grid, Paper, Typography, Button, Dialog, DialogActions, DialogContent, DialogTitle, Card, CardContent, FormControl, Box } from '@mui/material';



const AdvancedResultsPage = () => {

  const { brandName, dealershipName, department, submission } = useParams();
  const decodedDealershipName = decodeURIComponent(dealershipName);
  const decodedBrandName = decodeURIComponent(brandName);
  const decodedDepartment = decodeURIComponent(department);
  const decodedSubmission = decodeURIComponent(submission);
  const [popupItem, setPopupItem] = useState(null);
  //const filteredResults = logoResults.filter(result => result.dealership === decodedDealershipName);

  const [logoResults, setLogoResults] = useState([]);
  const [carResults, setCarResults] = useState([]);
  const [parkingResults, setParkingResults] = useState([]);
  const [hospitalityResults, setHospitalityResults] = useState([]);
  const [spatialResults, setSpatialResults] = useState([]);

  // Define state variables for other categories here

  useEffect(() => {
    // Fetch results for each category separately
    fetchLogoResults();
    fetchCarResults();
    fetchParkingResults();
    fetchHospitalityResults();
    fetchSpatialResults();
  }, []);

  const fetchLogoResults = () => {
    fetch(`/get-logo-results/${encodeURIComponent(decodedBrandName)}/${encodeURIComponent(decodedDealershipName)}/${encodeURIComponent(decodedDepartment)}/${encodeURIComponent(decodedSubmission)}`)
      .then(response => response.json())
      .then(data => {
        setLogoResults(data.images); // Set the logo detection results received from the backend
      })
      .catch(error => console.error('Error fetching logo results:', error));
  };

  const fetchCarResults = () => {
    fetch(`/get-car-results/${encodeURIComponent(decodedBrandName)}/${encodeURIComponent(decodedDealershipName)}/${encodeURIComponent(decodedDepartment)}/${encodeURIComponent(decodedSubmission)}`)
      .then(response => response.json())
      .then(data => {
        setCarResults(data.images); // Set the car detection results received from the backend
      })
      .catch(error => console.error('Error fetching car results:', error));
  };

  const fetchParkingResults = () => {
    fetch(`/get-parking-results/${encodeURIComponent(decodedBrandName)}/${encodeURIComponent(decodedDealershipName)}/${encodeURIComponent(decodedDepartment)}/${encodeURIComponent(decodedSubmission)}`)
      .then(response => response.json())
      .then(data => {
        setParkingResults(data.images); // Set the parking detection results received from the backend
      })
      .catch(error => console.error('Error fetching parking results:', error));
  };

  const fetchHospitalityResults = () => {
    fetch(`/get-hospitality-results/${encodeURIComponent(decodedBrandName)}/${encodeURIComponent(decodedDealershipName)}/${encodeURIComponent(decodedDepartment)}/${encodeURIComponent(decodedSubmission)}`)
      .then(response => response.json())
      .then(data => {
        setHospitalityResults(data.images); // Set the hospitality detection results received from the backend
      })
      .catch(error => console.error('Error fetching hospitality results:', error));
  };

  const fetchSpatialResults = () => {
    fetch(`/get-spatial-results/${encodeURIComponent(decodedBrandName)}/${encodeURIComponent(decodedDealershipName)}/${encodeURIComponent(decodedDepartment)}/${encodeURIComponent(decodedSubmission)}`)
      .then(response => response.json())
      .then(data => {
        setSpatialResults(data.images); // Set the spatial detection results received from the backend
      })
      .catch(error => console.error('Error fetching spatial results:', error));
  };


  const openPopup = (brandStandard) => {
    setPopupItem(brandStandard);
  };


  const closePopup = () => {
    setPopupItem(null);
  };

  const brandStandards = ['Logo Results', 'Car Detection', 'Parking Space', 'Hospitality', 'Spatial'];


  return (
    <React.Fragment>
      <Container maxWidth="lg" style={{ marginTop: '6rem', marginLeft: '12rem' }}> {/* Apply margin: auto */}
        <MaterialUI.SideBar />
        <Typography variant="h4" gutterBottom align="center">AuditBuddy Results for {decodedSubmission} at {decodedDealershipName}</Typography>
        <Grid container spacing={3} justifyContent="center">
          {brandStandards.map((result, index) => (
            <Grid item xs={12} key={index}>
              <Paper elevation={3} style={{ padding: '1rem', marginBottom: '1rem' }}>
                <Typography variant="h6" align="center">{result}</Typography>
                <Typography variant="body1" align="center">Overall Grade:</Typography>
                <Box display="flex" justifyContent="center">
                  {/* Pass the brand standard as an argument to openPopup */}
                  <Button variant="outlined" onClick={() => openPopup(result)}>View Advanced Details</Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
      {/* Pop-up Dialog */}
      <Dialog fullWidth open={popupItem !== null} onClose={closePopup} sx={{ marginLeft: 15, display: 'flex', flexDirection: 'column' }}>
        {/* Render different content based on the selected brand standard */}
        {popupItem === 'Logo Results' && (
          <>
            <DialogTitle>{popupItem}</DialogTitle>
            <DialogContent>
              <Box display="flex" justifyContent="space-between">
                {/* Left side: Description */}

                {/* Right side: Annotated Image */}
                <Box style={{ width: '50%', paddingLeft: '10px' }}>
                  {/* Map through logoResults array to display images */}
                  {logoResults.map((image, index) => (
                    <a key={index} href={image} target="_blank" rel="noopener noreferrer">
                      <img src={image} alt={`Annotated Image ${index}`} style={{ maxWidth: '100%', maxHeight: '100%', marginBottom: '10px' }} />
                    </a>
                  ))}
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
        {popupItem === 'Car Detection' && (
          <>
            <DialogTitle>{popupItem}</DialogTitle>
            <DialogContent>
              <Box display="flex" justifyContent="space-between">
                {/* Left side: Description */}

                {/* Right side: Annotated Image */}
                <Box style={{ width: '50%', paddingLeft: '10px' }}>
                  {/* Map through logoResults array to display images */}
                  {carResults.map((image, index) => (
                    <img key={index} src={image} alt={`Annotated Image ${index}`} style={{ maxWidth: '100%', maxHeight: '100%', marginBottom: '10px' }} />
                  ))}
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
        {popupItem === 'Parking Space' && (
          <>
            <DialogTitle>{popupItem}</DialogTitle>
            <DialogContent>
              <Box display="flex" justifyContent="space-between">
                {/* Left side: Description */}

                {/* Right side: Annotated Image */}
                <Box style={{ width: '50%', paddingLeft: '10px' }}>
                  {/* Map through logoResults array to display images */}
                  {parkingResults.map((image, index) => (
                    <img key={index} src={image} alt={`Annotated Image ${index}`} style={{ maxWidth: '100%', maxHeight: '100%', marginBottom: '10px' }} />
                  ))}
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
        {popupItem === 'Hospitality' && (
          <>
            <DialogTitle>{popupItem}</DialogTitle>
            <DialogContent>
              <Box display="flex" justifyContent="space-between">
                {/* Left side: Description */}

                {/* Right side: Annotated Image */}
                <Box style={{ width: '50%', paddingLeft: '10px' }}>
                  {/* Map through logoResults array to display images */}
                  {hospitalityResults.map((image, index) => (
                    <img key={index} src={image} alt={`Annotated Image ${index}`} style={{ maxWidth: '100%', maxHeight: '100%', marginBottom: '10px' }} />
                  ))}
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
        {popupItem === 'Spatial' && (
          <>
            <DialogTitle>{popupItem}</DialogTitle>
            <DialogContent>
              <Box display="flex" justifyContent="space-between">
                {/* Left side: Description */}

                {/* Right side: Annotated Image */}
                <Box style={{ width: '50%', paddingLeft: '10px' }}>
                  {/* Map through logoResults array to display images */}
                  {spatialResults.map((image, index) => (
                    <img key={index} src={image} alt={`Annotated Image ${index}`} style={{ maxWidth: '100%', maxHeight: '100%', marginBottom: '10px' }} />
                  ))}
                </Box>
              </Box>
            </DialogContent>
          </>
        )}
        <DialogActions>
          <MaterialUI.CustomButton onClick={closePopup}>Close</MaterialUI.CustomButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AdvancedResultsPage;