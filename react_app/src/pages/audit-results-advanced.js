// AdvancedResultsPage.js
import React from 'react';
import { Container, Grid, Paper, Typography, Button, Box } from '@mui/material';
import * as MaterialUI from '../components/MaterialUI';

const AdvancedResultsPage = ({ logoResults }) => {
  return (
    <Container maxWidth="lg" style={{ marginTop: '6rem' }}>
      <MaterialUI.SideBar />
      <Typography variant="h4" gutterBottom align="center">Logo Detection Results</Typography>
      <Grid container spacing={3}>
        {logoResults.map((result, index) => (
          <Grid item xs={12} key={index}>
            <Paper elevation={3} style={{ padding: '1rem', marginBottom: '1rem' }}>
              <Typography variant="h6" align="center">Result {index + 1}</Typography>
              <Typography variant="body1" align="center">Overall Grade: {result.grade}</Typography>
              <Box display="flex" justifyContent="center">
                <Button variant="outlined">View Advanced Details</Button>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default AdvancedResultsPage;
