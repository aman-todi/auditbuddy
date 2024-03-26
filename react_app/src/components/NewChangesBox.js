// NewChangesBox.jsx
import React, { useState, useEffect } from 'react';
import { Typography, Container, List, ListItem, ListItemText, Paper } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewChangesBox = () => {
  const [submittedData, setSubmittedData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubmittedData = async () => {
      try {
        const response = await axios.get('/get_submitted_data');
        setSubmittedData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchSubmittedData();
  }, []);

  const handleItemClick = async (item) => {
    try {
      const response = await axios.get(`/get_data_for_item?item=${item}`);
      const data = response.data;

      console.log("Data for NewChanges", data);

      sessionStorage.setItem('advancedResultsParams', JSON.stringify(data));

      navigate(`/audit/results/advanced-results`)
    } catch (error) {
      console.error('Error fetching data for item:', error);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: '16px', maxWidth: '100vw', margin: '0 auto', overflow: 'hidden', maxHeight: '50vh' }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: 'center' }}>
        New Changes
      </Typography>
      {submittedData.length > 0 && (
        <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
          {submittedData.length} Recent Uploads <br /> In Past 24 Hours
        </Typography>
      )}
      <List sx={{ width: 250, margin: 'auto', maxHeight: 175, overflow: 'auto', alignItems: 'center' }}>
        {submittedData.map((item, index) => (
          <ListItem key={index} button onClick={() => handleItemClick(item)}>
            <ListItemText primary={item} sx={{ alignItems: 'center' }} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default NewChangesBox;
