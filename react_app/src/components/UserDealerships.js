import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';

const UserDealershipImport = () => {
  // store user dealerships
  const [userDealerships, setUserDealerships] = useState([]);

  // get the dealerships when user enter page
  useEffect(() => {

    // axios request to get dealerships
    const fetchUserDealerships = async () => {
      try {
        const response = await axios.get('http://localhost:8080/user-dealerships');

        // set dealerships
        setUserDealerships(response.data);
        console.log(response.data)
      } catch (error) {
        console.error('Error fetching user dealerships:', error);
      }
    };

    // fetch dealerships
    fetchUserDealerships();
  }, []);

  return (
    <Container component="main" maxWidth="s">
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>My Dealerships</span>
        <Tooltip disableFocusListener title="List of all dealerships">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
      </Typography>
      {/* show user dealerships here */}
    </Container>
  );
};

export default UserDealershipImport;