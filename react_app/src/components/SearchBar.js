import React, { useState, useEffect } from 'react';
import { Box, TextField, InputLabel, Select, MenuItem, FormControl, Container, Typography, Tooltip } from '@mui/material';
import * as MaterialUI from '../components/MaterialUI'
import SearchIcon from '@mui/icons-material/Search';
import HelpIcon from '@mui/icons-material/Help';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs, { Dayjs } from 'dayjs';


export const SearchBar = ({ onSearch }) => {

  console.log("Contents of onSearch", onSearch);

  const [searchCriteria, setSearchCriteria] = useState({
    uploadName: '',
    dealership: '',
    brand: '',
    department: '',
    country: '',
    date: ''
  });


  // Handles form input changes
  const handleFormInput = (event, setFormInputState, field) => {


    if (field === 'date') {
      // If the field is 'date', convert the Dayjs object to a Date object
      const dateValue = event.toDate();
      setSearchCriteria(prevState => ({
        ...prevState,
        [field]: dateValue.toISOString() // Convert Date object to ISO string
      }));
      // Update the date state directly
      setDate(dateValue);
    } else {
      // For other fields, update as usual
      setFormInputState(event.target.value);
      setSearchCriteria(prevState => ({
        ...prevState,
        [field]: event.target.value
      }));
    }
  };



  // Handles search button click
  const handleSearchClick = () => {
    // Call the onSearch callback with the current search criteria
    console.log("Search Click", searchCriteria);
    onSearch(searchCriteria);
  };


  // states to keep track of form
  const [department, setDepartment] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [country, setCountry] = useState('');
  const [brandName, setBrand] = useState('');
  const [date, setDate] = useState(null);
  const [dealershipName, setDealershipName] = useState('');

  return (
    <Container component="main" maxWidth="s" fullWidth>
      <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center" }}>
        <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem", marginTop: "1rem" }}>
          <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Search</span>
          <Tooltip disableFocusListener title="Search for a specific dealership that matches the critera">
            <HelpIcon sx={{ fontSize: "small" }} />
          </Tooltip>
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center" }}>
        <TextField label="Upload Name" variant="outlined" onChange={(event) => handleFormInput(event, setUploadName, 'uploadName')}
          sx={{ margin: "0.1rem"}} fullWidth
        />
        <TextField label="Dealership Name" variant="outlined" onChange={(event) => handleFormInput(event, setDealershipName, 'dealership')}
          sx={{ margin: "0.1rem"}} fullWidth
        />
        <FormControl sx={{ margin: "0.1rem"}} fullWidth>
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
            <MenuItem value={"porsche"}>Porsche</MenuItem>
            <MenuItem value={"subaru"}>Subaru</MenuItem>
            <MenuItem value={"toyota"}>Toyota</MenuItem>
            <MenuItem value={"volkswagen"}>Volkswagen</MenuItem>

          </Select>
        </FormControl>
        <FormControl sx={{ margin: "0.1rem" }} fullWidth>
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
        <FormControl sx={{ margin: "0.1rem"}} fullWidth>
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

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Container components={['DatePicker']}>
            <DatePicker
              label="Date"
              value={date}
              onChange={(event) => handleFormInput(event, setDate, 'date')}
            />
          </Container>
        </LocalizationProvider>
        <MaterialUI.CustomButton onClick={handleSearchClick}>
          <SearchIcon />
        </MaterialUI.CustomButton>
      </Box>
    </Container >
  );
};