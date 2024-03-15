import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Typography, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import axios from 'axios';

const MinRequirements = () => {


  const [minRequirements, setMinRequirements] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (minRequirements) {
      console.log("d")
      console.log(minRequirements)
      setFormData(minRequirements);
    }
  }, [minRequirements]);

  const fetchData = async () => {
    try {
      const response = await axios.get('/get_brand_compliance_limits');
      const data = response.data;
      console.log(data);
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
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleChange = (brand, field, value) => {
    setFormData(prevState => ({
      ...prevState,
      [brand]: {
        ...prevState[brand],
        [field]: value
      }
    }));
  };

  const handleSubmit = async (formData, brand) => {
    try {
      const { selectedBrand, minCars, minParking, minSeating, minSqFt } = formData;
      const data = {
        selectedBrand : brand,
        minCars,
        minParking,
        minSeating,
        minSqFt
      };
      const response = await axios.post('http://localhost:8080/submit-min-requirements', data);
      console.log('Successful');
    } catch (error) {
      const { selectedBrand, minCars, minParking, minSeating, minSqFt } = formData;
      const data = {
        selectedBrand,
        minCars,
        minParking,
        minSeating,
        minSqFt
      };
      console.log(data)
      console.error('Error2', error);
    }
  };

  const brands = Object.keys(formData);

  return (
    <Container component="main" maxWidth="s">
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Add Minimum Compliance Standards</span>
        <Tooltip disableFocusListener title="Add in minimum compliance standards for different brands">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
      </Typography>
      <Box sx={{ maxHeight: "40vh", overflow: "auto", border: "1px solid #ccc" }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: 'center' }}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Select Brand</TableCell>
                  <TableCell align="center">Minimum Cars</TableCell>
                  <TableCell align="center">Minimum Parking</TableCell>
                  <TableCell align="center">Minimum Seating</TableCell>
                  <TableCell align="center">Minimum Square Feet</TableCell>
                  <TableCell align="center">Submit</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {brands.map((brand) => (
                  <TableRow key={brand}>
                    <TableCell component="th" scope="row">{brand}</TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={formData[brand]?.minCars || ''}
                        onChange={(e) => handleChange(brand, 'minCars', e.target.value)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={formData[brand]?.minParking || ''}
                        onChange={(e) => handleChange(brand, 'minParking', e.target.value)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={formData[brand]?.minSeating || ''}
                        onChange={(e) => handleChange(brand, 'minSeating', e.target.value)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <TextField
                        type="number"
                        value={formData[brand]?.minSqFt || ''}
                        onChange={(e) => handleChange(brand, 'minSqFt', e.target.value)}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ backgroundColor: '#74b42d' }}
                        onClick={() => handleSubmit(formData[brand], brand)}
                      >
                        Submit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Container>
  );
};

export default MinRequirements;