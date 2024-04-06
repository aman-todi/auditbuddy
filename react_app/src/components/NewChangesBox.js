// NewChangesBox.jsx
import React, { useState, useEffect } from 'react';
import { Typography, List, ListItem, ListItemText, Paper, useTheme, useMediaQuery} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const NewChangesBox = () => {

  // for mobile responsiveness
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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
    <Paper sx={{ padding: '1rem', width: isMobile ? '100vw' : '30vw', height: '25.5vh'}}>
      <Typography gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#74b42c' }}>
        New Changes
      </Typography>

      <Typography gutterBottom sx={{ textAlign: 'center' }}>
        {submittedData.length} Recent Uploads in Past 24 Hrs
      </Typography>

    
      <List component={Paper} sx={{ height: '15vh', maxHeight: '15vh', overflowY: 'auto', alignItems: 'center' }}>
        {submittedData.map((item, index) => (
          <ListItem key={index} onClick={() => handleItemClick(item)}>
            <ListItemText primary={item} sx={{ alignItems: 'center', cursor: 'pointer' }} />
          </ListItem>
        ))}
      </List>
    
    </Paper>
  );
};

export default NewChangesBox;
