import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Tooltip, Paper, TextField, Select, MenuItem } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import axios from 'axios';

const MinRequirements = () => {

  const [minRequirements, setMinRequirements] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [formData, setFormData] = useState({
    minCars: '',
    minParking: '',
    minSeating: '',
    minSqFt: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (minRequirements && selectedBrand) {
      setFormData(minRequirements[selectedBrand]);
    }
  }, [minRequirements, selectedBrand]);

  const fetchData = async () => {
    try {
      const response = await axios.get('/get_brand_compliance_limits');
      const data = response.data;
      const transformedData = {};
      data.forEach(item => {
        transformedData[item.brand] = {
          minCars: item.minCars,
          minParking: item.minParking,
          minSeating: item.minSeating,
          minSqFt: item.minSqFt
        };
      });
      setMinRequirements(transformedData);
      if (data.length > 0) {
        setSelectedBrand(data[0].brand); 
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const data = {
        selectedBrand,
        ...formData
      };
      await axios.post('/submit-min-requirements', data);
      console.log('Successful');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const brands = Object.keys(minRequirements || {});

  return (
    <Container component="main">
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Minimum Brand Standards</span>
        <Tooltip disableFocusListener title="Add in minimum compliance standards for different brands">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
      </Typography>
      <Box sx={{ display: "flex", alignItems: "flex-end", marginRight: "1rem", marginTop: "1rem" }}>
  <Select
    value={selectedBrand}
    onChange={(e) => setSelectedBrand(e.target.value)}
    displayEmpty
    inputProps={{ 'aria-label': 'Select Brand' }}
    style={{ width: "200px", marginRight: "1rem" }}
  >
    <MenuItem value="" disabled>Select Brand</MenuItem>
    {brands.map((brand) => (
      <MenuItem key={brand} value={brand}>{brand}</MenuItem>
    ))}
  </Select>
  {selectedBrand && (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center', marginTop: "1rem" }}>
      <TextField
        type="number"
        label="Cars"
        value={formData.minCars}
        onChange={(e) => handleChange('minCars', e.target.value)}
        style={{ marginRight: "1rem" }}
      />
      <TextField
        type="number"
        label="Parking"
        value={formData.minParking}
        onChange={(e) => handleChange('minParking', e.target.value)}
        style={{ marginRight: "1rem" }}
      />
      <TextField
        type="number"
        label="Seating"
        value={formData.minSeating}
        onChange={(e) => handleChange('minSeating', e.target.value)}
        style={{ marginRight: "1rem" }}
      />
      <TextField
        type="number"
        label="Square Feet"
        value={formData.minSqFt}
        onChange={(e) => handleChange('minSqFt', e.target.value)}
        style={{ marginRight: "1rem" }}
      />
    </Box>
  )}
</Box>
      {selectedBrand && (
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: 'center', marginTop: "1rem" }}>
          <Button
            variant="contained"
            color="primary"
            style={{ backgroundColor: '#74b42d' }}
            onClick={handleSubmit}
          >
            Submit
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default MinRequirements;