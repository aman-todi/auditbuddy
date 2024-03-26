import React, { useState, useEffect } from 'react';
import { Typography, Divider, Grid, Box, List, ListItem, ListItemText } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import axios from 'axios';

export function NewChanges() {
  const [submittedData, setSubmittedData] = useState([]);

  useEffect(() => {
    const fetchSubmittedData = async () => {
      try {
        const response = await fetch('/get_submitted_data');
        const data = await response.json();
        console.log(data)
        setSubmittedData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSubmittedData();
  }, []);
  console.log("SUBMITTED DATA")
  console.log(submittedData)
  return (
    <Box sx={{ 
        textAlign: 'center', margin: 'auto', width: 250, height: 275
    }}>
        <Typography variant="h4" gutterBottom>
            New Changes
        </Typography>
        {submittedData.length > 0 && (
            <Typography variant="h6" gutterBottom>
                {submittedData.length} Recent Uploads <br/> In Past 24 Hours
            </Typography>
        )}
        {submittedData.length > 0 && (
            <List sx={{ width: 250, margin: 'auto', maxHeight: 175, overflow: 'auto' , alignItems: 'center'}}>
                {submittedData.map((item, index) => (
                    <ListItem key={index}>
                        <ListItemText primary={item} sx={{alignItems: 'center'}}/>
                    </ListItem>
                ))}
            </List>
        )}
    </Box>

);
  
}

export function TopDealerships() {
  const [topDealerships, setTopDealerships] = useState([]);

  useEffect(() => {
    const fetchTopDealerships = async () => {
      try {
        const response = await fetch('/get_top_data');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        console.log("DATA");
        console.log(data);
        setTopDealerships(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTopDealerships();
  }, []);

  return (
    <Box sx={{ border: '1px solid #ccc', padding: '16px', maxWidth: '500px', margin: '0 auto', height: '350px', overflow: 'hidden', '@media (max-width: 800px)': { marginRight: '50px' } }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        Top Dealerships
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}> 
        <Typography gutterBottom sx={{ textAlign: 'center', display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span style={{ flex: 1, textAlign: 'center' }}>Name</span>
          <span style={{ flex: 1, textAlign: 'center' }}>UID</span>
          <span style={{ flex: 1, textAlign: 'center' }}>Score</span>
        </Typography>
      </Box>
      <Box sx={{ overflowY: 'auto', maxHeight: '250px' }}>
        <List>
          {topDealerships.map((dataItem, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
    <div style={{ flex: '1', textAlign: 'center' }}>
        <Typography variant="subtitle1" gutterBottom style={{ fontSize: '14px' }}>
            {dataItem[0]}
        </Typography> 
    </div>
    
    <div style={{ flex: '1', textAlign: 'center' }}>
        <ListItemText primary={dataItem[1][0]} style={{ display: 'block', textAlign: 'center' }} /> 
    </div>
    
    <div style={{ flex: '1', textAlign: 'center' }}>
        <ListItemText primary={dataItem[1][1]} style={{ display: 'block', textAlign: 'center' }} />
    </div>
</div>
          ))}
        </List>
      </Box>
    </Box>
  );
}

export function SearchBox({ onClickResult }) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchType, setSearchType] = useState('brand');

  const handleSearch = async (query) => {
    try {
      const response = await fetch(`/get_names?type=${searchType}&query=${query}`);
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const handleClick = async (result) => {
    try {
      const response = await fetch(`/get_graph_data?type=${searchType}&result=${result}`);
      const data = await response.json();
      console.log('Data from backend:', data);
    } catch (error) {
      console.error('Error fetching data from backend:', error);
    }
    onClickResult(result); 
    console.log('Clicked result:', result);
  };

  return (
    <div
      style={{
        width: '28vw',
        height: '86vh',
        border: '1px solid #ccc',
        margin: '8px',
        padding: '8px',
        overflow: 'auto',
      }}
    >
      <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
        <option value="brand">Brand</option>
        <option value="dealership">Dealership</option>
      </select>
      <input type="text" placeholder="Search..." onChange={(e) => handleSearch(e.target.value)} />
      <ul>
        {searchResults.map((result, index) => (
          <li key={index} onClick={() => handleClick(result)}>{result}</li>
        ))}
      </ul>
    </div>
  );
}

export function Box1Component({ clickedResult }) {
  return (
    <Box
      width="px"
      height={100}
      border={1}
      borderColor="black"
      
    >
      {clickedResult && <p>Clicked result: {clickedResult}</p>}
    </Box>
  );
}

export function Box2Component (){
    return (
        <div style={{ border: '1px solid #ccc', margin: '8px' }}>
        </div>
    );
};
