import React, { useState, useEffect } from 'react';
import {Box, TextField, InputLabel, Select, MenuItem, FormControl, Container} from '@mui/material';
import * as MaterialUI from '../components/MaterialUI'
import SearchIcon from '@mui/icons-material/Search';
export const SearchBar = (props) => {

    // handles each form input states
    const handleFormInput = (event, setFormInputState) => {
    setFormInputState(event.target.value);
    };

    // states to keep track of form
    const [department, setDepartment] = useState('');
    const [country, setCountry] = useState('');
    const [dealership, setDealership] = useState('');
    const [name, setName] = useState('');

    return (
    <Container component="main" maxWidth="s">
     <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center"}}>
     <TextField fullWidth label="ID" variant="outlined" onChange={(event) => handleFormInput(event, setName)}
          sx={{margin: "0.1rem"}}
        />
        <TextField fullWidth label="Dealership Name" variant="outlined" onChange={(event) => handleFormInput(event, setName)}
          sx={{margin: "0.1rem"}}
        />
        <FormControl fullWidth  sx={{margin: "0.1rem"}}>
          <InputLabel>Brand</InputLabel>
          <Select
            value={dealership}
            label="Brand"
            onChange={(event) => handleFormInput(event, setDealership)}
          >
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
        <FormControl fullWidth  sx={{margin: "0.1rem"}}>
          <InputLabel>Department</InputLabel>
          <Select
            value={department}
            label="Department"
            onChange={(event) => handleFormInput(event, setDepartment)}
          >
            <MenuItem value={"service"}>Service</MenuItem>
            <MenuItem value={"sales"}>Sales</MenuItem>
            <MenuItem value={"parts"}>Parts</MenuItem>
            <MenuItem value={"bodyandpaint"}>Body & Paint</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{margin: "0.1rem"}}>
          <InputLabel>Country</InputLabel>
          <Select
            value={country}
            label="Country"
            onChange={(event) => handleFormInput(event, setCountry)}
          >
            <MenuItem value={"usa"}>USA</MenuItem>
            <MenuItem value={"canada"}>Canada</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{margin: "0.1rem"}}>
          <InputLabel>Date</InputLabel>
          <Select
            value={country}
            label="Date"
            onChange={(event) => handleFormInput(event, setCountry)}
          >
          </Select>
        </FormControl>
        <MaterialUI.CustomButton><SearchIcon></SearchIcon></MaterialUI.CustomButton>
      </Box>
    </Container>
    );
};