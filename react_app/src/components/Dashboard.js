import React, { useState, useEffect } from 'react';
import { Typography, Divider, Grid, Box } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import axios from 'axios';

export function NewChanges() {
  return (
    <Box sx={{ marginLeft: 25 }}>
      <Typography variant="h4" gutterBottom>
        New Changes
      </Typography>
      <Divider sx={{ width: 225 }} /> 
      <Typography variant="h6" gutterBottom sx={{ marginTop: 2 }}>
        2 Recent Uploads <br></br> In Past 24 Hours
      </Typography>
      {/* uploads */}
    </Box>
  );
}

export function TopDealerships() {
    return (
        <Box sx={{ border: '1px solid #ccc', marginLeft: 25,width: 'fit-content', marginTop: 5 }}>
          <Typography variant="h4" gutterBottom>
            Top Dealerships
          </Typography>

        </Box>
      );
}
