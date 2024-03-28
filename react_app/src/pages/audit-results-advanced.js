import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import * as MaterialUI from '../components/MaterialUI';
import { Container, Typography, Button, Paper, useTheme, useMediaQuery, TextField } from '@mui/material';
import ResponsiveAppBar from '../components/ResponsiveAppBar';
import AdvancedResultsTabContent from '../components/AdvancedResultsTabContent';
import Chip from '@mui/material/Chip';
import axios from 'axios';
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';

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

  // handle an override of submission
  const handleOverride = () => {

    // call to the backend with submission information
    fetchData(submission, dealershipName, department);
  };

  // control the pop up
  const [popup, setPopup] = useState(false);
  const handlePopup = () => {
    setPopup(false);
  };


  // states for changing the detection values
  const [logo, setLogo] = useState(null);
  const [originalLogo, setOriginalLogo] = useState(logo);
  const [cars, setCars] = useState(null);
  const [originalCars, setOriginalCars] = useState(cars);
  const [parking, setParking] = useState(null);
  const [originalParking, setOriginalParking] = useState(parking);
  const [spatial, setSpatial] = useState(null);
  const [originalSpatial, setOriginalSpatial] = useState(spatial);
  const [hospitality, setHospitality] = useState(null);
  const [originalHospitality, setOriginalHospitality] = useState(hospitality);

  // need to add emotional api?

  // see if we are in edit mode
  const [editMode, setEditMode] = useState(false);

  // refresh the tabs
  const [refresh, setRefresh] = useState(false);

  // Function to trigger refresh
  const handleRefresh = () => {
    setRefresh(prevRefresh => !prevRefresh);
  };

  // cancel the edit
  const handleCancelEdit = () => {
    setLogo(originalLogo);
    setParking(originalParking);
    setCars(originalCars);
    setSpatial(originalSpatial);
    setHospitality(originalHospitality);
    setEditMode(false);
  };

  // exit from edit mode for editing detection
  const handleUpdate = () => {
    setEditMode(false);

    // call to the backend with the dealership information and new detection values
    updateValues(submission, dealershipName, department, logo, cars, parking, hospitality, spatial);
  };


  // function to update values of detection
  const updateValues = async (submission, dealershipName, department, logo, cars, parking, hospitality, spatial) => {
    try {
      // append to a form the dealership, new sales, and new uio
      const formData = new FormData();

      // extract information from dealership
      formData.append('time', submission);
      formData.append('dealershipName', dealershipName);
      formData.append('department', department);

      // extract information of the updated detection values
      formData.append('logo', logo);
      formData.append('cars', cars);
      formData.append('parking', parking);
      formData.append('spatial', spatial);
      formData.append('hospitality', hospitality);
      // formData.append('emotion', parking);

      // the new time
      const currentDate = new Date().toISOString();
      formData.append('updated', currentDate);

      // update the page that the submission was overrided by a user
      // to show who updated the values
      // setUpdatedTime(currentDate);

      const response = await axios.post('http://localhost:8080/submission-update-values', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // change the selected tab to the main page or it will crash
      setSelectedTab(0);
      // refresh the tabs component
      handleRefresh();

      console.log(response.data)
    } catch (error) {
      console.error('Error updating sales and uio:', error);
    }
  };

  // fetches the graded results for override submission
  const fetchData = async (submission, dealershipName, department) => {
    try {
      // Fetch grade results
      const formData = new FormData();
      formData.append('submission', submission);
      formData.append('name', dealershipName);
      formData.append('department', department);

      const gradeResponse = await axios.post('http://localhost:8080/get-category-eval', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // set each value from gradeResponse
      setLogo(gradeResponse.data["Detection"][0]);
      setCars(gradeResponse.data["Detection"][1]);
      setParking(gradeResponse.data["Detection"][2]);
      setHospitality(gradeResponse.data["Detection"][3]);
      setSpatial(gradeResponse.data["Detection"][4]);

      // open the pop up
      setPopup(true);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // delete pop up of confirmation
  const [popupDelete, setPopupDelete] = useState(false);
  const handlePopupDelete = () => {
    setPopupDelete(!popupDelete);
  };


  // handle a deletion of submission
  const handleDelete = () => {

    // call to the backend with submission information
    deleteSubmission(dealershipName, submission, brandName, department);
  };

  // function to delete a submission from the list
  const deleteSubmission = async (dealershipName, submission, brandName, department) => {
    try {

      // append to a form the submission information
      const formData = new FormData();

      // extract information from submission
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
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Chip label={department} style={{ backgroundColor: '#bae38c' }} />
          <Chip label={submission} />
        </div>
        {/* delete button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleOverride}>Override</Button>
          <Button color="error" onClick={handlePopupDelete}>Delete Submission</Button>
        </div>
        <Typography variant="h4" gutterBottom align="center" style={{ marginBottom: '2rem', marginTop: '3rem', display: 'flex', alignItems: 'center' }}>
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
          // this is just to re-render the component
          key={refresh}
          selectedTab={selectedTab}
          brandName={brandName}
          dealershipName={dealershipName}
          department={department}
          submission={submission}
        />
      </Paper >


      {/* dialog for override submission */}
      <Dialog open={popup} onClose={handlePopup} fullWidth maxWidth="lg">
        <DialogTitle>Override {dealershipName} {department} {submission}</DialogTitle>
        <DialogContent>
          <TextField
            label="Logos"
            value={logo}
            onChange={(e) => setLogo(e.target.value)}
            disabled={!editMode}
          />
          <TextField
            label="Cars"
            value={cars}
            onChange={(e) => setCars(e.target.value)}
            disabled={!editMode}
          />
          <TextField
            label="Parking"
            value={parking}
            onChange={(e) => setParking(e.target.value)}
            disabled={!editMode}
          />
          <TextField
            label="Hospitality"
            value={hospitality}
            onChange={(e) => setHospitality(e.target.value)}
            disabled={!editMode}
          />
          <TextField
            label="Spatial"
            value={spatial}
            onChange={(e) => setSpatial(e.target.value)}
            disabled={!editMode}
          />

          {/* the buttons to control edit/cancel/update */}
          <div>
            {!editMode && (
              <div>
                <MaterialUI.CustomButton onClick={() => { setEditMode(true); setOriginalLogo(logo); setOriginalCars(cars); setOriginalHospitality(hospitality); setOriginalSpatial(spatial); setOriginalParking(parking); }}>
                  Edit
                </MaterialUI.CustomButton>
              </div>
            )}
            {editMode && (
              <div>
                <MaterialUI.CustomButton onClick={handleUpdate}>Update</MaterialUI.CustomButton>
                <MaterialUI.CustomButton onClick={handleCancelEdit}>Cancel</MaterialUI.CustomButton>
              </div>
            )}
          </div>

        </DialogContent>
        <DialogActions>
          <MaterialUI.CustomButton onClick={handlePopup} color="primary">
            Close
          </MaterialUI.CustomButton>
        </DialogActions>
      </Dialog>

      {/* dialog for override submission */}
      <Dialog open={popupDelete} onClose={handlePopupDelete} fullWidth maxWidth="lg">
        <DialogTitle>Delete {dealershipName} {department} {submission}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this submission?</Typography>
          <div>
            <div>
              <MaterialUI.CustomButton onClick={handleDelete}>Yes</MaterialUI.CustomButton>
              <MaterialUI.CustomButton onClick={handlePopupDelete} color="primary">
                No
              </MaterialUI.CustomButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </Container>
  );
};

export default AdvancedResultsPage;
