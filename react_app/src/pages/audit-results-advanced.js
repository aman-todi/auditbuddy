import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as MaterialUI from '../components/MaterialUI';
import { Container, Typography, Grid, Paper } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import AdvancedResultsTabContent from '../components/AdvancedResultsTabContent';

const AdvancedResultsPage = () => {
  const { brandName, dealershipName, department, submission } = useParams();
  const decodedDealershipName = decodeURIComponent(dealershipName);
  const decodedBrandName = decodeURIComponent(brandName);
  const decodedDepartment = decodeURIComponent(department);
  const decodedSubmission = decodeURIComponent(submission);

  const [graphResults, setGraphResults] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    fetchGraphResults();
  }, []);

  const fetchGraphResults = () => {
    fetch(`/get-graph-results/${encodeURIComponent(decodedBrandName)}/${encodeURIComponent(decodedDealershipName)}/${encodeURIComponent(decodedDepartment)}/${encodeURIComponent(decodedSubmission)}`)
      .then(response => response.json())
      .then(data => {
        setGraphResults(data.images);
      })
      .catch(error => console.error('Error fetching graph results:', error));
  };

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
  };

  return (

    <Container maxWidth="lg" style={{ marginRight: '3rem', paddingTop: '5rem' }}>
      <MaterialUI.SideBar />
      <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '2rem', marginTop: '3rem' }}>
        AuditBuddy Results for {decodedSubmission} at {decodedDealershipName}
      </Typography>
      <Paper elevation={3} style={{ marginBottom: '2rem', marginTop: '3rem', padding: '1rem', marginRight: '4rem' }}>
        <ResponsiveAppBar handleTabChange={handleTabChange} />
        {selectedTab === 0 ? (
          <Grid container spacing={3} style={{ marginTop: "1rem" }}>
            {/* Display graphs horizontally */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom align="center">Graphs</Typography>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                {/* Render each graph with description */}
                {graphResults.map((item, index) => (
                  <Grid item xs={2} key={index}>
                    <Paper>
                      <img src={item} alt={`Graph ${index}`} style={{ width: '100%' }} />
                      <Typography variant="body2" align="center">Description for Graph {item}</Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <AdvancedResultsTabContent
            selectedTab={selectedTab}
            decodedBrandName={decodedBrandName}
            decodedDealershipName={decodedDealershipName}
            decodedDepartment={decodedDepartment}
            decodedSubmission={decodedSubmission}
          />
        )}
      </Paper >
    </Container>

  );
};

export default AdvancedResultsPage;


