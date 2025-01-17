import React, { useState } from 'react';
import '../App.css';
// material ui
import * as MaterialUI from './MaterialUI';
import HelpIcon from '@mui/icons-material/Help';
import { InputLabel, FormControl, MenuItem, Select, TextField, Container, Box, Tooltip, Typography, Alert } from '@mui/material/';
// axios
import axios from 'axios';
// filepond
import { FilePond, registerPlugin } from 'react-filepond';

// for the file validation
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
// for notifications
import { toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';

registerPlugin(FilePondPluginFileValidateType);


const AddDealershipImport = ({ refresh }) => {

  // state to keep track of a file box
  const [file, setFile] = useState(null);

  // handles how each file is added
  const handleFileAdded = (setDetectionState) => (fileItems) => {
    if (fileItems.length > 0) {
      const allFiles = fileItems.map(item => item.file);
      setDetectionState(allFiles);
    }
  };

  // handle uploading and submitting dealership
  const handleFileUpload = async () => {

    // create a form and append this file
    const formData = new FormData();

    // error checking
    if (!file) {
      setFileError('Please upload a .json file')
    }
    else {
      setFileError('')
      // append files to form data
      function appendFilesToFormData(files, formData, key) {
        if (files && files.length > 0) {
          files.forEach((file, index) => {
            formData.append(`${key}[${index}]`, file);
          });
        }
      }

      // call files to append to form
      appendFilesToFormData(file, formData, 'dealerships');

      // append the time
      const options = {
        timeZone: 'America/New_York',
      };

      const currentDate = new Date().toLocaleString('en-US', options) + " (EST)";

      formData.append('updated', currentDate);

      // notification that the files have been submitted
      const currentlyAnalyzing = toast(
        <div style={{ display: 'flex', alignItems: 'center' }}>
          Populating dealerships table
          <CircularProgress color="success" style={{ marginLeft: '10px' }} />
        </div>,
        { autoClose: false, closeButton: false }
      );

      try {
        const response = await axios.post('/prepopulate-dealerships', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // remove the first toast when the second one populates
        toast.dismiss(currentlyAnalyzing);
        // notification that the files have been analyzed

        toast.success(
          <div>
            Completed populating dealerships
          </div>
          , { autoClose: false, closeButton: true });

          refresh();

      }
      catch (error) {
        toast.dismiss(currentlyAnalyzing);
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          setFileError(`Error uploading file: ${error.response.data.error}`);
        } else if (error.request) {
          // The request was made but no response was received
          setFileError('Error uploading file: No response from server');
        }
      }
    }
  };

  // error message
  const [error, setError] = useState('')
  const [fileError, setFileError] = useState('')

  // states to keep track of form
  const [name, setName] = useState(''); // dealership name
  const [brand, setBrand] = useState(''); // dealership brand
  const [city, setCity] = useState(''); // dealership city
  const [state, setState] = useState(''); // dealership state
  const [uio, setUIO] = useState(''); // dealership uio
  const [sales, setSales] = useState(''); // dealership sales
  const [country, setCountry] = useState(''); // dealership country


  // handles each form input states
  const handleFormInput = (event, setFormInputState) => {
    setFormInputState(event.target.value);
  };

  const handleUpload = async () => {
    // form validation
    if (name === '') {
      setError('Please enter the dealership name')
    }
    else if (brand === '') {
      setError('Please select the dealership brand')
    }
    else if (city === '') {
      setError('Please input a city')
    }
    else if (state === '') {
      setError('Please input a state/province')
    }
    else if (country === '') {
      setError('Please input a country')
    }
    else if (uio === '') {
      setError('Please input the UIO')
    }
    else if (sales === '') {
      setError('Please input the Number of Sales')
    }
    else {
      // create a form and append this file
      const formData = new FormData();

      // name
      formData.append('name', name);
      // brand
      formData.append('brand', brand)
      // city
      formData.append('city', city);
      // state
      formData.append('state', state);
      // sales
      formData.append('sales', sales);
      // uio
      formData.append('uio', uio);
      // country
      formData.append('country', country);
      // date
      const options = {
        timeZone: 'America/New_York',
      };

      const currentDate = new Date().toLocaleString('en-US', options) + " (EST)";

      formData.append('updated', currentDate);

      try {
        const response = await axios.post('/add-dealership', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        refresh();
        setError(`Dealership added successfully`);
      }
      catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response:', error.response.data);
          setError(`Error adding dealership: ${error.response.data.error}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
          setError('Error adding dealership: No response from server');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
          setError('Error adding dealership');
        }
      }
    }
  };

  return (
    <Container component="main" maxWidth="s">
      {/* add dealership header */}
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Add Dealership</span>
        <Tooltip disableFocusListener title="The information of the dealership being added">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
      </Typography>
      <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center", justifyContent: 'center' }}>
        {/* dealership name */}
        <TextField required fullWidth label="Dealership Name" variant="outlined" onChange={(event) => handleFormInput(event, setName)}
          sx={{ margin: "0.1rem" }}
        />
        {/* select brand */}
        <FormControl required fullWidth sx={{ margin: "0.1rem" }}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={brand}
            label="Brand"
            onChange={(event) => handleFormInput(event, setBrand)}
          >
            <MenuItem value={"Audi"}>Audi</MenuItem>
            <MenuItem value={"BMW"}>BMW</MenuItem>
            <MenuItem value={"Cadillac"}>Cadillac</MenuItem>
            <MenuItem value={"Chevrolet"}>Chevrolet</MenuItem>
            <MenuItem value={"Ford"}>Ford</MenuItem>
            <MenuItem value={"Honda"}>Honda</MenuItem>
            <MenuItem value={"Kia"}>Kia</MenuItem>
            <MenuItem value={"Nissan"}>Nissan</MenuItem>
            <MenuItem value={"Porsche"}>Porsche</MenuItem>
            <MenuItem value={"Subaru"}>Subaru</MenuItem>
            <MenuItem value={"Toyota"}>Toyota</MenuItem>
            <MenuItem value={"Volkswagen"}>Volkswagen</MenuItem>
          </Select>
        </FormControl>
        {/* set uio */}
        <TextField required fullWidth label="UIO" variant="outlined" onChange={(event) => handleFormInput(event, setUIO)}
          sx={{ margin: "0.1rem" }}
        />
        {/* set sales */}
        <TextField required fullWidth label="# of Sales" variant="outlined" onChange={(event) => handleFormInput(event, setSales)}
          sx={{ margin: "0.1rem" }}
        />
      </Box>
      <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center", justifyContent: 'center' }}>
        {/* select city */}
        <TextField required fullWidth label="City" variant="outlined" onChange={(event) => handleFormInput(event, setCity)}
          sx={{ margin: "0.1rem" }} />
        {/* select state/province */}
        <TextField required fullWidth label="State/Province" variant="outlined" inputProps={{ maxLength: 2 }} onChange={(event) => handleFormInput(event, setState)}
          sx={{ margin: "0.1rem" }}
        />
        {/* set country */}
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
      {/* add dealership button and error */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0.1rem" }}>
        {error ? (
          <Alert severity={error === 'Dealership added successfully' ? 'success' : 'error'}>
            {error}
          </Alert>
        ) : null}
        <MaterialUI.CustomButton type="submit" onClick={handleUpload}>Add Dealership</MaterialUI.CustomButton>
      </Box>

      {/* being able to upload a file to prepopulate this data */}
      <Box sx={{marginTop: '5rem' }}>
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Import .txt with required JSON formatting</span>
        <Tooltip disableFocusListener title="The information of the dealership being added">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
      </Typography>
      <FilePond
              id="file"
              allowMultiple={true}
              acceptedFileTypes={'text/plain'}
              onupdatefiles={handleFileAdded(setFile)}
              maxFiles={1}
              stylePanelLayout={'compact'}
            />
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0.1rem" }}>
      {fileError ? (
          <Alert severity='error'>
            {fileError}
          </Alert>
        ) : null}
      <MaterialUI.CustomButton type="submit" onClick={handleFileUpload}>SUBMIT</MaterialUI.CustomButton>
      </Box>
    </Container>
  );
};

export default AddDealershipImport;
