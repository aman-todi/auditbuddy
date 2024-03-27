import React, { useState, useEffect, useRef } from 'react';
import '../App.css';
// filepond
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
// material ui
import * as MaterialUI from './MaterialUI';
import HelpIcon from '@mui/icons-material/Help';
import { InputLabel, FormControl, TextField, MenuItem, Select, Container, Box, Tab, Tabs, Tooltip, Typography, Alert } from '@mui/material/';
import CircularProgress from '@mui/material/CircularProgress';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import VideocamIcon from '@mui/icons-material/Videocam';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

// for notifications
import { toast } from 'react-toastify';

// for getting the current user
import { auth } from '../components/Authentication';


// axios
import axios from 'axios';

// for the file validation
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

registerPlugin(FilePondPluginFileValidateType);

const FormImport = () => {

  // navigation
  const navigate = useNavigate();

  // for checking dark mode
  const theme = useTheme();
  const isDarkTheme = theme.palette.mode === 'dark';

  // states to keep track of each file drop box
  const [logo, setLogo] = useState(null);
  const [parking, setParking] = useState(null);
  const [cars, setCars] = useState(null);
  const [hospitality, setHospitality] = useState(null);
  const [spatial, setSpatial] = useState(null);
  const [emotion, setEmotion] = useState(null);
  const [error, setError] = useState("")

  // state to keep track department
  const [department, setDepartment] = useState('');
  // state to keep track name
  const [name, setName] = useState('');
  // state to store selected user dealership
  const [dealerships, setDealerships] = useState([]);
  // store the preset dealerships
  const [dealershipsList, setDealershipsList] = useState([]);

  // get the preset dealerships when user enter page
  useEffect(() => {

    // axios request to get dealerships
    const fetchUserDealerships = async () => {
      try {
        const response = await axios.post('http://localhost:8080/user-dealerships');

        // set dealerships
        setDealershipsList(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching user dealerships:', error);
      }
    };

    // fetch dealerships
    fetchUserDealerships();
  }, []);

  // handle uploading and submitting to analyze
  const handleUpload = async () => {

    // create a form and append this file
    const formData = new FormData();

    // extract information from dealership
    // name
    formData.append('name', dealerships['Dealership Name']);
    // department
    formData.append('department', department);
    // country
    formData.append('country', dealerships['Country']);
    // brand
    formData.append('dealership', dealerships['Brand']);
    // uid
    formData.append('uid', dealerships['UID']);
    // sales
    formData.append('sales', dealerships['Sales']);
    // uio
    formData.append('uio', dealerships['UIO']);

    // error checking
    if (department === '') {
      setError('Please select a department')
    }
    else if (name === '') {
      setError('Please create a name for upload')
    }
    else if (!logo && !cars && !parking && !spatial && !hospitality) {
      setError('Please select a file in at least one category')
    }
    else if (!logo) {
      setError('Please upload logo files')
    }
    else if (!cars) {
      setError('Please upload cars files')
    }
    else if (!parking) {
      setError('Please upload parking files')
    }
    else if (!spatial) {
      setError('Please upload spatial files')
    }
    else if (!hospitality) {
      setError('Please upload hospitality files')
    }
    else {
      setError('')
      // append files to form data
      function appendFilesToFormData(files, formData, key) {
        if (files && files.length > 0) {
          files.forEach((file, index) => {
            formData.append(`${key}[${index}]`, file);
          });
        }
      }

      // call files to append to form
      appendFilesToFormData(logo, formData, 'logo');
      appendFilesToFormData(hospitality, formData, 'hospitality');
      appendFilesToFormData(parking, formData, 'parking');
      appendFilesToFormData(spatial, formData, 'spatial');
      appendFilesToFormData(cars, formData, 'cars');

      appendFilesToFormData(emotion, formData, 'emotion');

      // Get the current timestamp
      const time = new Date().toISOString();
      formData.append('submission', time)

      // notification that the files have been submitted
      const currentlyAnalyzing = toast(
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Analyzing {dealerships['UID']} {dealerships['Dealership Name']} {department}
          <CircularProgress color="success" style={{ marginLeft: '10px' }} />
        </div>,
        { autoClose: false, closeButton: false }
      );

      // Append the name of the submission
      formData.append('uploadName', name)

      // get logged in user
      const user = auth.currentUser;
      if (user)
      {
        const email = user.email;
        // append the users email
        formData.append('email', email);
      } 

      try {
        const response = await axios.post('/upload-video', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // remove the first toast when the second one populates
        toast.dismiss(currentlyAnalyzing);
        // notification that the files have been analyzed

        // find the result
        const navigateToResults = {
          'Department': department,
          'Brand': dealerships['Brand'],
          'Dealership Name': dealerships['Dealership Name'],
          'Submitted': time
        };
       
        sessionStorage.setItem('advancedResultsParams', JSON.stringify(navigateToResults));

        toast.success(
          <div>
            Completed {dealerships['UID']} {dealerships['Dealership Name']} {department}
            <div>
              <MaterialUI.CustomButton onClick={() => navigate(`/audit/results/advanced-results`)}>View</MaterialUI.CustomButton>
            </div>
          </div>
          , { autoClose: false, closeButton: true });

      }
      catch (error) {
        toast.dismiss(currentlyAnalyzing);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(`Error uploading file: ${error.response.data.error}`);
        } else if (error.request) {
          // The request was made but no response was received
          setError('Error uploading file: No response from server');
        }
      }
    }
  };

  // handles each form input states
  const handleFormInput = (event, setFormInputState) => {
    console.log(event.target.value);
    setFormInputState(event.target.value);
    console.log(event.target.value);
  };

  // handles how each file is added
  const handleFileAdded = (setDetectionState) => (fileItems) => {
    if (fileItems.length > 0) {
      const allFiles = fileItems.map(item => item.file);
      setDetectionState(allFiles);
    }
  };

  // handle tab index to change tabs
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  return (
    <Container component="main">
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Dealership</span>
        <Tooltip disableFocusListener title="The information of the dealership being submitted">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
      </Typography>

      <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center" }}>
        <FormControl required fullWidth sx={{ margin: "0.1rem" }}>
          <InputLabel>Dealership</InputLabel>
          <Select
            // name
            value={dealerships}
            label="Dealerships"
            // setName
            onChange={(event) => handleFormInput(event, setDealerships)}
          >
            {dealershipsList.map((dealership, index) => (
              <MenuItem key={index} value={dealership}>
                {dealership['UID']} {dealership['Dealership Name']}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center" }}>
        <FormControl required fullWidth sx={{ margin: "0.1rem" }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={department}
            label="Department"
            onChange={(event) => handleFormInput(event, setDepartment)}
          >
            <MenuItem value={"Service"}>Service</MenuItem>
            <MenuItem value={"Sales"}>Sales</MenuItem>
            <MenuItem value={"Parts"}>Parts</MenuItem>
            <MenuItem value={"Body and Paint"}>Body & Paint</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center" }}>
      <FormControl required fullWidth sx={{ margin: "0.1rem" }}>
        <TextField label="Name of Upload" variant="outlined" onChange={(event) => handleFormInput(event, setName)}
        />
      </FormControl>
      </Box>

      {/* detection header */}
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem", marginTop: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Detection</span>
        <Tooltip disableFocusListener title="Upload files in the categories that you'd like to detect">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
      </Typography>

      {/* handle the tab change  */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} indicatorColor="primary">
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ fontSize: '0.75rem' }}
          variant="scrollable"
          scrollButtons="auto"
          TabIndicatorProps={{
            style: {
              backgroundColor: "#74b42c",
            }
          }}
        >
          <Tab label={<span style={{ display: 'flex', alignItems: 'center', color: isDarkTheme ? 'rgb(245,245,245)' : 'rgb(50,50,50)', }}>LOGOS<PhotoCameraIcon sx={{ fontSize: '1rem'}} /></span>} />
          <Tab label={<span style={{ display: 'flex', alignItems: 'center', color: isDarkTheme ? 'rgb(245,245,245)' : 'rgb(50,50,50)',  }}>DISPLAY CARS<PhotoCameraIcon sx={{ fontSize: '1rem'}} /><VideocamIcon sx={{ fontSize: '1rem' }} /></span>} />
          <Tab label={<span style={{ display: 'flex', alignItems: 'center', color: isDarkTheme ? 'rgb(245,245,245)' : 'rgb(50,50,50)',  }}>PARKING SPACES<PhotoCameraIcon sx={{ fontSize: '1rem' }} /><VideocamIcon sx={{ fontSize: '1rem' }} /></span>} />
          <Tab label={<span style={{ display: 'flex', alignItems: 'center', color: isDarkTheme ? 'rgb(245,245,245)' : 'rgb(50,50,50)',  }}>HOSPITALITY<PhotoCameraIcon sx={{ fontSize: '1rem' }} /><VideocamIcon sx={{ fontSize: '1rem' }} /></span>} />
          <Tab label={<span style={{ display: 'flex', alignItems: 'center', color: isDarkTheme ? 'rgb(245,245,245)' : 'rgb(50,50,50)',  }}>SPATIAL<PhotoCameraIcon sx={{ fontSize: '1rem' }} /></span>} />
          <Tab label={<span style={{ display: 'flex', alignItems: 'center', color: isDarkTheme ? 'rgb(245,245,245)' : 'rgb(50,50,50)',  }}>EMOTION<PhotoCameraIcon sx={{ fontSize: '1rem' }} /><VideocamIcon sx={{ fontSize: '1rem' }} /></span>} />
        </Tabs>
      </Box>

      <Box>
        {/* logo files input  */}
        <div style={{ display: tabIndex === 0 ? 'block' : 'none' }}>
          <Box sx={{ marginTop: '1rem' }}>
            <FilePond
              id="logo"
              allowMultiple={true}
              acceptedFileTypes={['image/*']}
              onupdatefiles={handleFileAdded(setLogo)}
              stylePanelLayout={'compact'}
            />
          </Box>
        </div>

        {/* count cars files input  */}
        <div style={{ display: tabIndex === 1 ? 'block' : 'none' }}>
          <Box sx={{ marginTop: '1rem' }}>
            <FilePond
              id="cars"
              allowMultiple={true}
              onupdatefiles={handleFileAdded(setCars)}
              stylePanelLayout={'compact'}
            />
          </Box>
        </div>

        {/* count parking files input  */}
        <div style={{ display: tabIndex === 2 ? 'block' : 'none' }}>
          <Box sx={{ marginTop: '1rem' }}>
            <FilePond
              id="parking"
              allowMultiple={true}
              onupdatefiles={handleFileAdded(setParking)}
              stylePanelLayout={'compact'}
            />
          </Box>
        </div>

        {/* hospitality files input  */}
        <div style={{ display: tabIndex === 3 ? 'block' : 'none' }}>
          <Box sx={{ marginTop: '1rem' }}>
            <FilePond
              id="hospitality"
              allowMultiple={true}
              onupdatefiles={handleFileAdded(setHospitality)}
              stylePanelLayout={'compact'}
            />
          </Box>
        </div>

        {/* spatial files input  */}
        <div style={{ display: tabIndex === 4 ? 'block' : 'none' }}>
          <Box sx={{ marginTop: '1rem' }}>
            <FilePond
              id="spatial"
              allowMultiple={true}
              maxFiles={3}
              acceptedFileTypes={['image/*']}
              onupdatefiles={handleFileAdded(setSpatial)}
              stylePanelLayout={'compact'}
            />
          </Box>
        </div>

        {/* emotion files input  */}
        <div style={{ display: tabIndex === 5 ? 'block' : 'none' }}>
          <Box sx={{ marginTop: '1rem' }}>
            <FilePond
              id="emotion"
              allowMultiple={true}
              onupdatefiles={handleFileAdded(setEmotion)}
              stylePanelLayout={'compact'}
            />
          </Box>
        </div>
      </Box>

      {/* submission button and display error  */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0.1rem" }}>
        {error ? (
          <Alert severity={error === 'File(s) uploaded successfully:' ? 'success' : 'error'}>
            {error}
          </Alert>
        ) : null}
        {error ? (
          <Alert severity='error'>
            {error}
          </Alert>
        ) : null}
        <MaterialUI.CustomButton type="submit" onClick={handleUpload}>Analyze</MaterialUI.CustomButton>
      </Box>
    </Container>
  );
};

export default FormImport;
