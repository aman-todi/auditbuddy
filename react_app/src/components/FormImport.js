import React, { useState } from 'react';
import '../App.css';
// filepond
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
// material ui
import * as MaterialUI from './MaterialUI';
import HelpIcon from '@mui/icons-material/Help';

// import ShowResults from './pages/audit-results';
import { InputLabel, FormControl, MenuItem, Select, TextField, Container, Box, Tab, Tabs, Tooltip, Typography} from '@mui/material/';
// axios
import axios from 'axios';

const FormImport = () => {

  // states to keep track of each file drop box
  const [logo, setLogo] = useState(null);
  const [parking, setParking] = useState(null);
  const [cars, setCars] = useState(null);
  const [hospitality, setHospitality] = useState(null);
  const [spatial, setSpatial] = useState(null);
  
  // states to keep track of form
  const [department, setDepartment] = useState('');
  const [country, setCountry] = useState('');
  const [dealership, setDealership] = useState('');
  const [name, setName] = useState('');

  const handleLogoAdded = (fileItems) => {
    if (fileItems.length > 0) {
      // set the state of file (this for one file)
      setLogo(fileItems[0].file)
    }
  };

  const handleCarsAdded = (fileItems) => {
    if (fileItems.length > 0) {
      // set the state of file (this for one file)
      setCars(fileItems[0].file)
    }
  };

  const handleParkingAdded = (fileItems) => {
    if (fileItems.length > 0) {
      // set the state of file (this for one file)
      setParking(fileItems[0].file)
    }
  };

  const handleHospitalityAdded = (fileItems) => {
    if (fileItems.length > 0) {
      // set the state of file (this for one file)
      setHospitality(fileItems[0].file)
    }
  };

  const handleSpatialAdded = (fileItems) => {
    if (fileItems.length > 0) {
      // set the state of file (this for one file)
      setSpatial(fileItems[0].file)
    }
  };

  // handles each form input states
  const handleFormInput = (event, setFormInputState) => {
    setFormInputState(event.target.value);
  };

  const handleUpload = async () => {
    // form validation
    if (name === '') {
      alert('Please enter the dealership name')
    }
    else if (dealership === '') {
      alert('Please select a dealership')
    }
    else if (department === '') {
      alert('Please select a department')
    }
    else if (country === '') {
      alert('Please select a country')
    }
    else if (!logo && !cars && !parking && !spatial && !hospitality) {
      alert('Please select a file in atleast one category')
    }
    else {
      // create a form and append this file
      // single image
      const formData = new FormData();

      // default rn until rest of backend is implemented
      formData.append('logo', logo);
      formData.append('hospitality', hospitality);
      formData.append('parking', parking);
      formData.append('spatial', spatial);
      formData.append('cars', cars);

      // name
      formData.append('name', name);
      // department
      formData.append('department', department);
      // country
      formData.append('country', country)
      // dealership
      formData.append('dealership', dealership)

      try {
        const response = await axios.post('http://localhost:8080/upload-video', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert(`File uploaded successfully: ${response.data.filename}`);
      }
      catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response:', error.response.data);
          alert(`Error uploading file: ${error.response.data.error}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
          alert('Error uploading file: No response from server');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
          alert('Error uploading file');
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
              <span style={{ fontWeight: "bold", marginRight: "0.5rem"}}>Dealership</span>
              <Tooltip disableFocusListener title="The information of the dealership being submitted">
                <HelpIcon sx={{fontSize: "small"}}/>
              </Tooltip>
            </Typography>
      <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center"}}>
        <TextField fullWidth required label="Dealership Name" variant="outlined" onChange={(event) => handleFormInput(event, setName)}
          sx={{margin: "0.1rem"}}
        />
        <FormControl required fullWidth  sx={{margin: "0.1rem"}}>
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
        <FormControl required fullWidth  sx={{margin: "0.1rem"}}>
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
        <FormControl required fullWidth sx={{margin: "0.1rem"}}>
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
              <span style={{ fontWeight: "bold", marginRight: "0.5rem"}}>Detection</span>
              <Tooltip disableFocusListener title="Upload files in the categories that you'd like to detect">
                <HelpIcon sx={{fontSize: "small"}}/>
              </Tooltip>
            </Typography>
      <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} indicatorColor="primary">
      <Tabs value={tabIndex} onChange={handleTabChange} sx={{fontSize: '0.75rem'}}
      TabIndicatorProps={{
        style: {
          backgroundColor: "#74b42c",
        }
      }}
      >
        <Tab label={<span style={{ color: 'rgb(50,50,50)' }}>LOGOS</span>}/>
        <Tab label={<span style={{ color: 'rgb(50,50,50)' }}>DISPLAY CARS</span>}/>
        <Tab label={<span style={{ color: 'rgb(50,50,50)' }}>PARKING SPACES</span>}/>
        <Tab label={<span style={{ color: 'rgb(50,50,50)' }}>HOSPITALITY</span>}/>
        <Tab label={<span style={{ color: 'rgb(50,50,50)' }}>SPATIAL</span>}/>
      </Tabs>
      </Box>

      <Box>
 
      <div style={{ display: tabIndex === 0 ? 'block' : 'none' }}>
        <Box sx={{ marginTop: '1rem' }}>
          <FilePond
            allowMultiple={false}
            onupdatefiles= {handleLogoAdded}
            stylePanelLayout={'compact'}
          />
        </Box>
      </div> 

      <div style={{ display: tabIndex === 1 ? 'block' : 'none' }}>
          <Box sx={{marginTop: '1rem'}}>
            <FilePond
          allowMultiple={false}
          onupdatefiles={handleCarsAdded}
          stylePanelLayout={'compact'}
        />
          </Box>
      </div>

      <div style={{ display: tabIndex === 2 ? 'block' : 'none' }}>
          <Box sx={{marginTop: '1rem'}}>
            <FilePond
          allowMultiple={false}
          onupdatefiles={handleParkingAdded}
          stylePanelLayout={'compact'}
        />
          </Box>
      </div>

      <div style={{ display: tabIndex === 3 ? 'block' : 'none' }}>
          <Box sx={{marginTop: '1rem'}}>
            <FilePond
          allowMultiple={false}
          onupdatefiles={handleHospitalityAdded}
          stylePanelLayout={'compact'}
        />
          </Box>
      </div>

      <div style={{ display: tabIndex === 4 ? 'block' : 'none' }}>
          <Box sx={{marginTop: '1rem'}}>
            <FilePond
          allowMultiple={false}
          onupdatefiles={handleSpatialAdded}
          stylePanelLayout={'compact'}
        />
          </Box>
      </div>
      </Box>
     
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0.1rem"}}>
        <MaterialUI.CustomButton type="submit" onClick={handleUpload}>Analyze</MaterialUI.CustomButton>
      </Box>
    </Container>
  );
};

export default FormImport;
