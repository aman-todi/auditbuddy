// audit-results.js
import React, { useEffect, useState } from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import { Container, Paper, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { auth } from '../components/Authentication';

function ResultsPage() {

  const [annotatedImages, setAnnotatedImages] = useState([]);
  const [firstAnnotatedImage, setFirstAnnotatedImage] = useState(null);

  useEffect(() => {

    fetch('/get-first-annotated-image')
      .then(response => response.json())
      .then(data => {
        setFirstAnnotatedImage(data.filename);
        setAnnotatedImages(data.images); // Assuming the response contains an array of image filenames
      })
      .catch(error => console.error('Error fetching first annotated image:', error));

  });

  const openAnnotatedImageInNewTab = (imageName) => {
    window.open(`/annotated_images/${imageName}`, '_blank');
  };

  const user = auth.currentUser;

  return (
    <React.Fragment>
      { user ? (
        <React.Fragment>
          <MaterialUI.SideBar />
      <Container maxWidth="md" style={{ marginTop: '2rem' }}>
        <Paper elevation={3} style={{ padding: '2rem', maxHeight: '70vh', overflowY: 'auto' }}>
          <Typography variant="h5" gutterBottom>Results</Typography>
          {annotatedImages.length === 0 ? (
            <Typography variant="body1">No annotated images available.</Typography>
          ) : (
            annotatedImages.map((image, index) => (
              <div key={index} className="result-item">
                <CheckCircleOutlineIcon style={{ position: 'absolute', top: 0, left: 0, color: 'green' }} />
                <Typography variant="h6" align="center">Result {index + 1}</Typography>
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => openAnnotatedImageInNewTab(image)}
                  >
                    Open Image
                  </Button>
                </div>
              </div>
            ))
          )}
        </Paper>
      </Container>
    </React.Fragment>
      ) : (<p>Not Authorized</p>)
    
    }
      </React.Fragment>
  );
}

export default ResultsPage;
