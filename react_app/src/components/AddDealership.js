import React, { useState } from 'react';
import '../App.css';
// filepond
import 'filepond/dist/filepond.min.css';
// material ui
import * as MaterialUI from './MaterialUI';
import HelpIcon from '@mui/icons-material/Help';

// import ShowResults from './pages/audit-results';
import { InputLabel, FormControl, MenuItem, Select, TextField, Container, Box, Tab, Tabs, Tooltip, Typography } from '@mui/material/';
// axios
import axios from 'axios';

const AddDealershipImport = () => {

  // states to keep track of form
  const [name, setName] = useState(''); // dealership name
  const [brand, setBrand] = useState(''); // dealership brand
  const [address, setAddress] = useState(''); // dealership address
  const [country, setCountry] = useState(''); // dealership country

  // handles each form input states
  const handleFormInput = (event, setFormInputState) => {
    setFormInputState(event.target.value);
  };

  const handleUpload = async () => {
    // form validation
    if (name === '') {
      alert('Please enter the dealership name')
    }
    else if (brand === '') {
      alert('Please select the dealership brand')
    }
    else if (country === '') {
      alert('Please select a country')
    }
    else {
      // create a form and append this file
      const formData = new FormData();

      // name
      formData.append('name', name);
      // address
      formData.append('address', address);
      // country
      formData.append('country', country)
      // brand
      formData.append('brand', brand)

      try {
        const response = await axios.post('http://localhost:8080/add-dealership', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        alert(`Dealership added successfully:`);
      }
      catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error('Error response:', error.response.data);
          alert(`Error adding dealersgip: ${error.response.data.error}`);
        } else if (error.request) {
          // The request was made but no response was received
          console.error('Error request:', error.request);
          alert('Error adding dealership: No response from server');
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error('Error message:', error.message);
          alert('Error adding dealership');
        }
      }
    }
  };

  return (
    <Container component="main" maxWidth="s">
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Add Dealership</span>
        <Tooltip disableFocusListener title="The information of the dealership being added">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
      </Typography>
      <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center" }}>
        <TextField required label="Dealership Name" variant="outlined" onChange={(event) => handleFormInput(event, setName)}
          sx={{ margin: "0.1rem", width:"85vw"}}
        />
        <FormControl required sx={{ margin: "0.1rem", width: "30vw"}}>
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
            <MenuItem value={"Subaru"}>Subaru</MenuItem>
            <MenuItem value={"Toyota"}>Toyota</MenuItem>
            <MenuItem value={"Volkswagen"}>Volkswagen</MenuItem>
          </Select>
        </FormControl>
        </Box>
        <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center" }}>
        <TextField required fullWidth label="Address" variant="outlined" onChange={(event) => handleFormInput(event, setAddress)}
          sx={{ margin: "0.1rem"}}
        />
        </Box>

      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0.1rem" }}>
        <MaterialUI.CustomButton type="submit" onClick={handleUpload}>Add Dealership</MaterialUI.CustomButton>
      </Box>
    </Container>
  );
};

export default AddDealershipImport;
