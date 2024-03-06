import React, { useState } from 'react';
import '../App.css';
// filepond
import 'filepond/dist/filepond.min.css';
// material ui
import * as MaterialUI from './MaterialUI';
import HelpIcon from '@mui/icons-material/Help';

// import ShowResults from './pages/audit-results';
import { InputLabel, FormControl, MenuItem, Select, TextField, PaperProps, Container, Box, Tab, Tabs, Tooltip, Typography, Autocomplete} from '@mui/material/';
// axios
import axios from 'axios';

const AddDealershipImport = () => {

  // error message
  const [error, setError] = useState('')
  // address auto complete
  const [options, setOptions] = useState([]);

  // states to keep track of form
  const [name, setName] = useState(''); // dealership name
  const [brand, setBrand] = useState(''); // dealership brand
  const [city, setCity] = useState(''); // dealership city
  const [state, setState] = useState(''); // dealership state
  const [uio, setUIO] = useState(''); // dealership uio
  const [sales, setSales] = useState(''); // dealership sales


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
      setError('Please input a state')
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
      formData.append('uio', uio)

      try {
        const response = await axios.post('http://localhost:8080/add-dealership', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
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
    <Container component= "main" maxWidth="s">
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Add Dealership</span>
        <Tooltip disableFocusListener title="The information of the dealership being added">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
      </Typography>
      <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center", justifyContent: 'center' }}>
        <TextField required label="Dealership Name" variant="outlined" onChange={(event) => handleFormInput(event, setName)}
          sx={{ margin: "0.1rem", width:"22.5vw"}}
        />
         <FormControl required sx={{ margin: "0.1rem", width: "10vw"}}>
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
        <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center", justifyContent: 'center' }}>
        <TextField required label="City" variant="outlined" onChange={(event) => handleFormInput(event, setCity)}
          sx={{ margin: "0.1rem", width:"15vw"}}/>
        <TextField required label="State" variant="outlined" inputProps={{ maxLength: 2 }} onChange={(event) => handleFormInput(event, setState)}
          sx={{ margin: "0.1rem", width:"7.5vw"}}
        />
        <TextField required label="UIO" variant="outlined" onChange={(event) => handleFormInput(event, setUIO)}
          sx={{ margin: "0.1rem", width:"10vw"}}
        />
        <TextField required label="# of Sales" variant="outlined" onChange={(event) => handleFormInput(event, setSales)}
          sx={{ margin: "0.1rem", width:"10vw"}}
        />
        </Box>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0.1rem" }}>
        <MaterialUI.CustomButton type="submit" onClick={handleUpload}>Add Dealership</MaterialUI.CustomButton>
        {error && <p id="error">{error}</p>}
      </Box>
    </Container>
  );
};

export default AddDealershipImport;
