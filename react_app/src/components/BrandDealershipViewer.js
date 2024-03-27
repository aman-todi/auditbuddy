import React, { useState, useEffect } from 'react';
import { Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, CircularProgress, FormControl, InputLabel, Select, MenuItem, TextField, Box, Container } from '@mui/material';
import axios from 'axios';
import DashboardGraph from './DashboardGraph';

const BrandDealershipViewer = ({ onClickResult }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState('brand');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [clickedResult, setClickedResult] = useState(null);

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      const response = await axios.get(`/get_names?type=${searchType}&query=${query}`);
      const dataArray = Object.keys(response.data).map((key) => ({
        [key]: response.data[key]
      }));
      setSearchResults(dataArray);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setLoading(false); // Set loading to false in case of an error
    }
  };

  const handleClick = (result) => {
    // Handle click logic here if needed
    onClickResult(result);
    setClickedResult(result); // Set the clicked result
    console.log('Clicked result:', result);
  };

  useEffect(() => {
    // Fetch initial search results when component mounts
    handleSearch('');
  }, []); // Empty dependency array to only run on mount

  useEffect(() => {
    // Fetch search results when search type changes
    handleSearch(searchQuery);
  }, [searchType, searchQuery]); // Watch for changes in searchType and searchQuery

  return (
    <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
      <Container>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
          Brand / Delaership Viewer
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Select
            labelId="search-type-label"
            id="search-type"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <MenuItem value="brand">Brand</MenuItem>
            <MenuItem value="dealership">Dealership</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Search"
          id="search"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ m: 1, width: '25ch' }}
        />
        <TableContainer component={Paper} sx={{ maxHeight: '50vh', overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Logo Avg</TableCell>
                <TableCell>Car Avg</TableCell>
                <TableCell>Parking Avg</TableCell>
                <TableCell>Hospitality Avg</TableCell>
                <TableCell>Spatial Avg</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && searchResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center"><CircularProgress color="success" /></TableCell>
                </TableRow>
              ) : (
                searchResults.length > 0 && Array.from({ length: searchResults[0]['Car Avg'].length }).map((_, index) => (
                  <TableRow key={index} sx={{ cursor: 'pointer' }} onClick={() => handleClick(searchResults[3]['Name'][index])}>
                    <TableCell>{searchResults[3]['Name'][index]}</TableCell>
                    <TableCell>{searchResults[2]['Logo Avg'][index]}</TableCell>
                    <TableCell>{searchResults[0]['Car Avg'][index]}</TableCell>
                    <TableCell>{searchResults[4]['Parking Avg'][index]}</TableCell>
                    <TableCell>{searchResults[1]['Hospitality Avg'][index]}</TableCell>
                    <TableCell>{searchResults[5]['Spatial Avg'][index]}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Encapsulate the graph within a separate container */}
        <Box mt={3} mb={3} sx={{ display: 'flex', justifyContent: 'center' }}>
          <Container>
            <DashboardGraph clickedResult={clickedResult} type={searchType} />
          </Container>
        </Box>
      </Container>
    </Paper>
  );
};

export default BrandDealershipViewer;
