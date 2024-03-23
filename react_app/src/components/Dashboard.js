import React, { useState, useEffect } from 'react';
import { Typography, Divider, Grid, Box } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import axios from 'axios';

export function NewChanges() {
  return (
    <Box style={{marginBottom: "5rem"}}>
      <Typography variant="h4" gutterBottom>
        New Changes
      </Typography>
      <Divider /> 
      <Typography variant="h6" gutterBottom>
        2 Recent Uploads <br></br> In Past 24 Hours
      </Typography>
      {/* uploads */}
    </Box>
  );
}

export function TopDealerships() {
    return (
        <Box sx={{ border: '1px solid #ccc',width: 'fit-content'}}>
          <Typography variant="h4" gutterBottom>
            Top Dealerships
          </Typography>

        </Box>
      );
}
