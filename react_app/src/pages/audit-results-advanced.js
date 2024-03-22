import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import * as MaterialUI from '../components/MaterialUI';
import { Container, Typography, Button, Paper, useTheme, useMediaQuery } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import AdvancedResultsTabContent from '../components/AdvancedResultsTabContent';

const AdvancedResultsPage = () => {

  const [brandName, setBrandName] = useState('');
  const [dealershipName, setDealershipName] = useState('');
  const [department, setDepartment] = useState('');
  const [submission, setSubmission] = useState('');

  useEffect(() => {
    // Retrieve parameters from session storage
    const params = JSON.parse(sessionStorage.getItem('advancedResultsParams'));
    console.log("PARAMS", params);
    if (!params) {
      // Handle case when parameters are not available
      // For example, redirect to the results page
      navigate('/audit/results');
    }

    // Handle your logic with the parameters here
    setBrandName(params["Brand"]);
    setDealershipName(params["Dealership Name"]);
    setDepartment(params["Department"]);
    setSubmission(params["Submitted"]);

    return () => {
      // Clear session storage when the component unmounts
      sessionStorage.removeItem('advancedResultsParams');
    };
  }, []);

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue);
  };

  const { search } = useLocation();
  const navigate = useNavigate();

  // Parse the query parameter to extract the previous URL
  const queryParams = new URLSearchParams(search);
  const prevUrl = queryParams.get('prev');

  const handleGoBack = () => {
    // Navigate back to the previous URL
    navigate('/audit/results');
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  console.log("Checking Values", brandName, dealershipName, department, submission);

  return (
    <Container maxWidth="lg" style={{ marginRight: '3rem', paddingTop: '5rem' }}>
      <MaterialUI.SideBar />
      <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '2rem', marginTop: '3rem', position: 'relative' }}>
        {/* Position the "Back" button next to the title */}
        <Button
          variant="contained"
          onClick={handleGoBack}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundColor: '#74b42c'
          }}
        >
          Back
        </Button>
        AuditBuddy Results for {dealershipName}
      </Typography>
      <Paper elevation={3} style={{ marginBottom: '2rem', marginTop: '3rem', padding: '1rem', marginRight: '4rem' }}>
        <ResponsiveAppBar handleTabChange={handleTabChange} />
        <AdvancedResultsTabContent
          selectedTab={selectedTab}
          brandName={brandName}
          dealershipName={dealershipName}
          department={department}
          submission={submission}
        />
      </Paper >
    </Container>
  );
};

export default AdvancedResultsPage;
