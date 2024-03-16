import React, { useState } from 'react';
import '../App.css';
// material ui
import * as MaterialUI from './MaterialUI';
import HelpIcon from '@mui/icons-material/Help';
import { InputLabel, FormControl, MenuItem, Select, TextField, Container, Box, Tooltip, Typography, Alert } from '@mui/material/';
// axios
import axios from 'axios';

const AddDealershipImport = ({ refresh }) => {

  // error message
  const [error, setError] = useState('')

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
      const currentDate = new Date();
      formData.append('updated', currentDate);

      try {
        const response = await axios.post('http://localhost:8080/add-dealership', formData, {
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
    </Container>
  );
};

export default AddDealershipImport;
