import React, { useState } from 'react';
import { Box, Button, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Tooltip } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import axios from 'axios';

const MinRequirements = () => {
  const [selectedBrand, setSelectedBrand] = useState('');
  const [minCars, setMinCars] = useState('');
  const [minParking, setMinParking] = useState('');
  const [minSeating, setMinSeating] = useState('');
  const [minSqFt, setMinSqFt] = useState('');

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
  };

  const handleMinCarsChange = (event) => {
    setMinCars(event.target.value);
  };

  const handleParkingChange = (event) => {
    setMinParking(event.target.value);
  };

  const handleSeatingChange = (event) => {
    setMinSeating(event.target.value);
  };

  const handleSqFtChange = (event) => {
    setMinSqFt(event.target.value);
  };
const handleSubmit = async (event) => {
  event.preventDefault();
  try {
    const formData = {
      selectedBrand,
      minCars,
      minParking,
      minSeating,
      minSqFt,
    };

    const response = await axios.post('http://localhost:8080/submit-min-requirements', formData);
    console.log('successful');
  } catch (error) {
    console.error('error', error);
  }
};

  return (
    <Container component="main" maxWidth="s">
        <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
            <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Add Minimum Compliance Standards</span>
            <Tooltip disableFocusListener title="Add in minimum compliance standards for different brands">
            <HelpIcon sx={{ fontSize: "small" }} />
            </Tooltip>
        </Typography>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center' }}>
        <FormControl required fullWidth sx={{ margin: "0.1rem" }}>
          <InputLabel>Select Brand</InputLabel>
          <Select
            label="Select Brand"
            value={selectedBrand}
            onChange={handleBrandChange}
          >
            <MenuItem value="Audi">Audi</MenuItem>
            <MenuItem value="BMW">BMW</MenuItem>
            <MenuItem value="Cadillac">Cadillac</MenuItem>
            <MenuItem value="Chevrolet">Chevrolet</MenuItem>
            <MenuItem value="Ford">Ford</MenuItem>
            <MenuItem value="Honda">Honda</MenuItem>
            <MenuItem value="Kia">Kia</MenuItem>
            <MenuItem value="Nissan">Nissan</MenuItem>
            <MenuItem value="Subaru">Subaru</MenuItem>
            <MenuItem value="Toyota">Toyota</MenuItem>
            <MenuItem value="Volkswagen">Volkswagen</MenuItem>
          </Select>
        </FormControl>
        {selectedBrand && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center' }}>
            <form onSubmit={handleSubmit} >
              <FormControl required fullWidth sx={{ margin: "0.1rem" }}>
                <TextField
                  label={`Minimum Cars for ${selectedBrand}`}
                  type="number"
                  value={minCars}
                  onChange={handleMinCarsChange}
                />
              </FormControl>
              <FormControl required fullWidth sx={{ margin: "0.1rem" }}>
                <TextField
                  label={`Minimum Parking for ${selectedBrand}`}
                  type="number"
                  value={minParking}
                  onChange={handleParkingChange}
                />
              </FormControl>
              <FormControl required fullWidth sx={{ margin: "0.1rem" }}>
                <TextField
                  label={`Minimum Seating for ${selectedBrand}`}
                  type="number"
                  value={minSeating}
                  onChange={handleSeatingChange}
                />
              </FormControl>
              <FormControl required fullWidth sx={{ margin: "0.1rem" }}>
                <TextField
                  label={`Minimum Square Feet for ${selectedBrand}`}
                  type="number"
                  value={minSqFt}
                  onChange={handleSqFtChange}
                />
              </FormControl>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0.1rem" }}>
              <Button type="submit" variant="contained" color="primary" style={{ backgroundColor: '#74b42d'}} sx={{ margin: "0.1rem" }}>
                Submit
              </Button>
              </Box>
            </form>
          </Box>
        )}
      </Box>
    </Container>
  );
};




export default MinRequirements;