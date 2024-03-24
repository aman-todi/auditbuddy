import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import * as MaterialUI from '../components/MaterialUI';
import { Container, Typography, Button, Paper, useTheme, useMediaQuery } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import AdvancedResultsTabContent from '../components/AdvancedResultsTabContent';
import Chip from '@mui/material/Chip';
import axios from 'axios';

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

   // handle a deletion
   const handleDelete = () => {

    // call to the backend with submission information
    deleteSubmission(dealershipName, submission, brandName, department);
  }

  // function to delete a dealership from the list
  const deleteSubmission = async (dealershipName, submission, brandName, department) => {
  try {

    // append to a form the dealership information
    const formData = new FormData();

    // extract information from dealership
    formData.append('name', dealershipName)
    formData.append('time', submission)
    formData.append('brand', brandName)
    formData.append('department', department)

    const response = await axios.post('http://localhost:8080/delete-submission', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
      // once the submission is deleted, then we need to return the user to the results page
      navigate('/audit/results');

      console.log(response.data)
    } catch (error) {
      console.error('Error deleting dealership', error);
    }
  };

  console.log("Checking Values", brandName, dealershipName, department, submission);

  return (
    <Container maxWidth="lg" fullWidth style={{ paddingTop: '5rem' }}>
      <Paper style={{ marginBottom: '2rem', marginTop: '1rem', padding: '1rem' }}>
         {/* add badge for department and submission */}
      <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
        <Chip label={department}  style={{ backgroundColor: '#bae38c' }}/>
        <Chip label={submission}/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
        <Button color="error" onClick={handleDelete}>Delete Submission</Button>
      </div>
      <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '2rem', marginTop: '3rem', display: 'flex', alignItems: 'center'}}>
      {/* back button */}
      <Button
        variant="contained"
        onClick={handleGoBack}
        style={{
          backgroundColor: '#74b42c',
          marginRight: 'auto'
        }}
      >
        Back
      </Button>
  
      {/* dealership name */}
        AuditBuddy Results for {dealershipName}
    </Typography>
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
