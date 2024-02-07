import React, { useEffect, useState } from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import { Container, Grid, Paper, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { auth } from '../components/Authentication';

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


  return (
    <React.Fragment>
      {user ? (
        <React.Fragment>
          <MaterialUI.SideBar />
          <Container maxWidth="lg" style={{ marginTop: '6rem' }}>
            <Typography variant="h4" gutterBottom align="center">Results</Typography>
            {logoResults.length === 0 ? (
              <Typography variant="body1">No annotated images available.</Typography>
            ) : (
              <Grid container spacing={3}>
                {/* Logo Detection Results */}
                <Grid item xs={12}>
                  <Paper elevation={3} style={{ padding: '1rem' }}>
                    <Typography variant="h5" align="center">Logo Detection Results</Typography>
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

                {/* Add more Grid items for other categories */}

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


              </Grid>
            )}
          </Container>
        </React.Fragment>
      ) : (<p>Not Authorized</p>)}
    </React.Fragment>
  );
}

export default ResultsPage;
