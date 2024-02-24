import React, { useState } from 'react';
import '../App.css';
// filepond
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
// material ui
import * as MaterialUI from './MaterialUI';
import HelpIcon from '@mui/icons-material/Help';

// import ShowResults from './pages/audit-results';
import { InputLabel, FormControl, MenuItem, Select, TextField, Container, Box, Tab, Tabs, Tooltip, Typography, Alert } from '@mui/material/';
// axios
import axios from 'axios';

const FormImport = () => {

  // states to keep track of each file drop box
  const [logo, setLogo] = useState(null);
  const [parking, setParking] = useState(null);
  const [cars, setCars] = useState(null);
  const [hospitality, setHospitality] = useState(null);
  const [spatial, setSpatial] = useState(null);
  const [error, setError] = useState("")

  // states to keep track of form
  const [department, setDepartment] = useState('');
  const [country, setCountry] = useState('');
  const [dealership, setDealership] = useState('');
  const [name, setName] = useState('');

  const handleLogoAdded = (fileItems) => {
    if (fileItems.length > 0) {
      const allFiles = fileItems.map(item => item.file);
      setLogo(allFiles);
    }
  };

  const handleCarsAdded = (fileItems) => {
    if (fileItems.length > 0) {
      const allFiles = fileItems.map(item => item.file);
      setCars(allFiles);
    }
  };

  const handleParkingAdded = (fileItems) => {
    if (fileItems.length > 0) {
      const allFiles = fileItems.map(item => item.file);
      setParking(allFiles);
    }
  };

  const handleHospitalityAdded = (fileItems) => {
    if (fileItems.length > 0) {
      const allFiles = fileItems.map(item => item.file);
      setHospitality(allFiles);
    }
  };

  const handleSpatialAdded = (fileItems) => {
    if (fileItems.length > 0) {
      const allFiles = fileItems.map(item => item.file);
      setSpatial(allFiles);
    }
  };

  // handles each form input states
  const handleFormInput = (event, setFormInputState) => {
    setFormInputState(event.target.value);
  };

  const handleUpload = async () => {
    // form validation
    if (name === '') {
      setError('Please enter the dealership name')
    }
    else if (dealership === '') {
      setError('Please select a dealership')
    }
    else if (department === '') {
      setError('Please select a department')
    }
    else if (country === '') {
      setError('Please select a country')
    }
    else if (!logo && !cars && !parking && !spatial && !hospitality) {
      setError('Please select a file in atleast one category')
    }
    else {
      // create a form and append this file
      const formData = new FormData();

      // logo
      if (logo && logo.length > 0) {
        logo.forEach((file, index) => {
          formData.append(`logo[${index}]`, file);
        });
      }

      // hospitality
      if (hospitality && hospitality.length > 0) {
        hospitality.forEach((file, index) => {
          formData.append(`hospitality[${index}]`, file);
        });
      }

      // parking
      if (parking && parking.length > 0) {
        parking.forEach((file, index) => {
          formData.append(`parking[${index}]`, file);
        });
      }

      // spatial
      if (spatial && spatial.length > 0) {
        spatial.forEach((file, index) => {
          formData.append(`spatial[${index}]`, file);
        });
      }

      // cars
      if (cars && cars.length > 0) {
        cars.forEach((file, index) => {
          formData.append(`cars[${index}]`, file);
        });
      }

      // name
      formData.append('name', name);
      // department
      formData.append('department', department);
      // country
      formData.append('country', country)
      // dealership
      formData.append('dealership', dealership)

      // Get the current timestamp
      const time = new Date().toISOString();

      formData.append('submission', time)

      try {
        const response = await axios.post('http://localhost:8080/upload-video', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert(`File(s) uploaded successfully:`);
      }
      catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setError(`Error uploading file: ${error.response.data.error}`);
        } else if (error.request) {
          // The request was made but no response was received
          setError('Error uploading file: No response from server');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
          setError('Error uploading file');
        }
      }
    }
  };

  // handle tab index to change tabs
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
  };

  return (
    <Container component="main" maxWidth="s">
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Dealership</span>
        <Tooltip disableFocusListener title="The information of the dealership being submitted">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
      </Typography>
      <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center" }}>
        <TextField fullWidth required label="Dealership Name" variant="outlined" onChange={(event) => handleFormInput(event, setName)}
          sx={{ margin: "0.1rem" }}
        />
        <FormControl required fullWidth sx={{ margin: "0.1rem" }}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={dealership}
            label="Brand"
            onChange={(event) => handleFormInput(event, setDealership)}
          >
            <MenuItem value={"Audi"}>Audi</MenuItem>
            <MenuItem value={"BMW"}>BMW</MenuItem>
            <MenuItem value={"Cadillac"}>Cadillac</MenuItem>
            <MenuItem value={"Chevrolet"}>Chevrolet</MenuItem>
            <MenuItem value={"Ford"}>Ford</MenuItem>
            <MenuItem value={"Honda"}>Honda</MenuItem>
            <MenuItem value={"Kia"}>Kia</MenuItem>
            <MenuItem value={"Nissan"}>Nissan</MenuItem>
            <MenuItem value={"Subaru"}>Subaru</MenuItem>
            <MenuItem value={"Toyota"}>Toyota</MenuItem>
            <MenuItem value={"Volkswagen"}>Volkswagen</MenuItem>
          </Select>
        </FormControl>
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
        <FormControl required fullWidth sx={{ margin: "0.1rem" }}>
          <InputLabel>Country</InputLabel>
          <Select
            value={country}
            label="Country"
            onChange={(event) => handleFormInput(event, setCountry)}
          >
            <MenuItem value={"USA"}>USA</MenuItem>
            <MenuItem value={"Canada"}>Canada</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem", marginTop: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Detection</span>
        <Tooltip disableFocusListener title="Upload files in the categories that you'd like to detect">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} indicatorColor="primary">
        <Tabs value={tabIndex} onChange={handleTabChange} sx={{ fontSize: '0.75rem' }}
          TabIndicatorProps={{
            style: {
              backgroundColor: "#74b42c",
            }
          }}
        >
          <Tab label={<span>LOGOS</span>} />
          <Tab label={<span>DISPLAY CARS</span>} />
          <Tab label={<span>PARKING SPACES</span>} />
          <Tab label={<span>HOSPITALITY</span>} />
          <Tab label={<span>SPATIAL</span>} />
        </Tabs>
      </Box>

      <Box>

        <div style={{ display: tabIndex === 0 ? 'block' : 'none' }}>
          <Box sx={{ marginTop: '1rem' }}>
            <FilePond
              allowMultiple={true}
              onupdatefiles={handleLogoAdded}
              stylePanelLayout={'compact'}
            />
          </Box>
        </div>

        <div style={{ display: tabIndex === 1 ? 'block' : 'none' }}>
          <Box sx={{ marginTop: '1rem' }}>
            <FilePond
              allowMultiple={true}
              onupdatefiles={handleCarsAdded}
              stylePanelLayout={'compact'}
            />
          </Box>
        </div>

        <div style={{ display: tabIndex === 2 ? 'block' : 'none' }}>
          <Box sx={{ marginTop: '1rem' }}>
            <FilePond
              allowMultiple={true}
              onupdatefiles={handleParkingAdded}
              stylePanelLayout={'compact'}
            />
          </Box>
        </div>

        <div style={{ display: tabIndex === 3 ? 'block' : 'none' }}>
          <Box sx={{ marginTop: '1rem' }}>
            <FilePond
              allowMultiple={true}
              onupdatefiles={handleHospitalityAdded}
              stylePanelLayout={'compact'}
            />
          </Box>
        </div>

        <div style={{ display: tabIndex === 4 ? 'block' : 'none' }}>
          <Box sx={{ marginTop: '1rem' }}>
            <FilePond
              allowMultiple={true}
              maxFiles={3}
              onupdatefiles={handleSpatialAdded}
              stylePanelLayout={'compact'}
            />
          </Box>
        </div>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0.1rem" }}>
        <MaterialUI.CustomButton type="submit" onClick={handleUpload}>Analyze</MaterialUI.CustomButton>
        {error && <p id="error">{error}</p>}
      </Box>
    </Container>
  );
};

export default FormImport;
