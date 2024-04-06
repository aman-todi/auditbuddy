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

  console.log("searchResults", searchResults);

  return (
    <Paper sx={{ padding: "1rem", marginBottom: "1rem",  width: '65vw', height: '75vh', maxHeight: '75vh'}}>
      <Container>
        <Typography gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#74b42c'}}>
          Brand / Dealership Viewer
        </Typography>
        <FormControl sx={{ m: "1rem", minWidth: "10rem" }}>
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
          sx={{ m: "1rem", width: '25rem', float: 'right' }}
        />

        <TableContainer component={Paper} sx={{ height: '20vh', maxHeight: '20vh', overflowY: 'auto' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Logo Avg</TableCell>
                <TableCell>Car Avg</TableCell>
                <TableCell>Parking Avg</TableCell>
                <TableCell>Hospitality Avg</TableCell>
                <TableCell>Spatial Avg</TableCell>
                <TableCell>Emotional Avg</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading && searchResults.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center"><CircularProgress color="success" /></TableCell>
                </TableRow>
              ) : (
                searchResults.length > 0 && Array.from({ length: searchResults[0]['Car Avg'].length }).map((_, index) => (
                  <TableRow key={index} sx={{ cursor: 'pointer' }} onClick={() => handleClick(searchResults[4]['Name'][index])}>
                    <TableCell>{searchResults[4]['Name'][index]}</TableCell>
                    <TableCell>{searchResults[3]['Logo Avg'][index]}</TableCell>
                    <TableCell>{searchResults[0]['Car Avg'][index]}</TableCell>
                    <TableCell>{searchResults[5]['Parking Avg'][index]}</TableCell>
                    <TableCell>{searchResults[2]['Hospitality Avg'][index]}</TableCell>
                    <TableCell>{searchResults[6]['Spatial Avg'][index]}</TableCell>
                    <TableCell>{searchResults[1]['Emotional Avg'][index]}</TableCell>
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
