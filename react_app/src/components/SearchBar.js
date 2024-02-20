import React, { useState, useEffect } from 'react';
import { Box, TextField, InputLabel, Select, MenuItem, FormControl, Container, Typography, Tooltip} from '@mui/material';
import * as MaterialUI from '../components/MaterialUI'
import SearchIcon from '@mui/icons-material/Search';
import HelpIcon from '@mui/icons-material/Help';


export const SearchBar = ({ onSearch }) => {

  console.log("Contents of onSearch", onSearch);

  const [searchCriteria, setSearchCriteria] = useState({
    dealership: '',
    brand: '',
    department: '',
    country: ''
  });

  // Handles form input changes
  const handleFormInput = (event, setFormInputState, field) => {
    const value = event.target.value;
    setFormInputState(value); // Update the form input state
    setSearchCriteria(prevState => ({
      ...prevState,
      [field]: value // Update the corresponding field in the search criteria
    }));
  };


  // Handles search button click
  const handleSearchClick = () => {
    // Call the onSearch callback with the current search criteria
    console.log("Search Click", searchCriteria);
    onSearch(searchCriteria);
  };


  // states to keep track of form
  const [department, setDepartment] = useState('');
  const [ID, setID] = useState('');
  const [country, setCountry] = useState('');
  const [brandName, setBrand] = useState('');
  const [dealershipName, setDealershipName] = useState('');

  return (
    <Container component="main" maxWidth="s">
      <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center" }}>
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem", marginTop: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Search</span>
        <Tooltip disableFocusListener title="Search for a specific dealership that matches the critera">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
      </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center" }}>
        <TextField label="ID" variant="outlined"
          sx={{ margin: "0.1rem", width: "25vw" }}
        />
        <TextField label="Dealership Name" variant="outlined" onChange={(event) => handleFormInput(event, setDealershipName, 'dealership')}
          sx={{ margin: "0.1rem", width: "75vw" }}
        />
        <FormControl sx={{ margin: "0.1rem", width: "35vw" }}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={brandName}
            label="Brand"
            onChange={(event) => handleFormInput(event, setBrand, 'brand')}
          >
            <MenuItem value={""} style={{ height: '2rem' }}></MenuItem>
            <MenuItem value={"audi"}>Audi</MenuItem>
            <MenuItem value={"bmw"}>BMW</MenuItem>
            <MenuItem value={"cadillac"}>Cadillac</MenuItem>
            <MenuItem value={"chevrolet"}>Chevrolet</MenuItem>
            <MenuItem value={"ford"}>Ford</MenuItem>
            <MenuItem value={"honda"}>Honda</MenuItem>
            <MenuItem value={"kia"}>Kia</MenuItem>
            <MenuItem value={"nissan"}>Nissan</MenuItem>
            <MenuItem value={"subaru"}>Subaru</MenuItem>
            <MenuItem value={"toyota"}>Toyota</MenuItem>
            <MenuItem value={"volkswagen"}>Volkswagen</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ margin: "0.1rem", width: "40vw" }}>
          <InputLabel>Department</InputLabel>
          <Select
            value={department}
            label="Department"
            onChange={(event) => handleFormInput(event, setDepartment, 'department')}
          >
            <MenuItem value={""} style={{ height: '2rem' }}></MenuItem>
            <MenuItem value={"service"}>Service</MenuItem>
            <MenuItem value={"sales"}>Sales</MenuItem>
            <MenuItem value={"parts"}>Parts</MenuItem>
            <MenuItem value={"bodyandpaint"}>Body & Paint</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ margin: "0.1rem", width: "30vw" }}>
          <InputLabel>Country</InputLabel>
          <Select
            value={country}
            label="Country"
            onChange={(event) => handleFormInput(event, setCountry, 'country')}
          >
            <MenuItem value={""} style={{ height: '2rem' }}></MenuItem>
            <MenuItem value={"usa"}>USA</MenuItem>
            <MenuItem value={"canada"}>Canada</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ margin: "0.1rem", width: "50vw" }}>
          <InputLabel>Date</InputLabel>
          <Select
            value={country}
            label="Date"

          >
          </Select>
        </FormControl>
        <MaterialUI.CustomButton onClick={handleSearchClick}>
          <SearchIcon />
        </MaterialUI.CustomButton>
      </Box>
    </Container>
  );
};