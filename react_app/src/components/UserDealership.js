import React, { useState } from 'react';
import '../App.css';
// filepond
import 'filepond/dist/filepond.min.css';
// material ui
import * as MaterialUI from './MaterialUI';
import HelpIcon from '@mui/icons-material/Help';

// import ShowResults from './pages/audit-results';
import { InputLabel, FormControl, MenuItem, Select, TextField, Container, Box, Tab, Tabs, Tooltip, Typography } from '@mui/material/';
// axios
import axios from 'axios';

const UserDealershipImport = () => {

  return (
    <Container component="main" maxWidth="s">
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>My Dealerships</span>
        <Tooltip disableFocusListener title="Your preset dealerships">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
      </Typography>
    </Container>
  );
};

export default UserDealershipImport;
