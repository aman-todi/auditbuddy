import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import * as MaterialUI from '../components/MaterialUI';
import { Container, Typography, Button, Paper, useTheme, useMediaQuery } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import AdvancedResultsTabContent from '../components/AdvancedResultsTabContent';

const AdvancedResultsPage = () => {
  const { brandName, dealershipName, department, submission } = useParams();
  const decodedDealershipName = decodeURIComponent(dealershipName);
  const decodedBrandName = decodeURIComponent(brandName);
  const decodedDepartment = decodeURIComponent(department);
  const decodedSubmission = decodeURIComponent(submission);

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
    navigate(prevUrl);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
        AuditBuddy Results for {decodedDealershipName}
      </Typography>
      <Paper elevation={3} style={{ marginBottom: '2rem', marginTop: '3rem', padding: '1rem', marginRight: '4rem' }}>
        <ResponsiveAppBar handleTabChange={handleTabChange} />
        <AdvancedResultsTabContent
          selectedTab={selectedTab}
          decodedBrandName={decodedBrandName}
          decodedDealershipName={decodedDealershipName}
          decodedDepartment={decodedDepartment}
          decodedSubmission={decodedSubmission}
        />
      </Paper >
    </Container>
  );
};

export default AdvancedResultsPage;
