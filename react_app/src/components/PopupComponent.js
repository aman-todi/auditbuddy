import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import { CustomButton } from './MaterialUI'; // Assuming you have a CustomButton component

const PopupComponent = ({ listings }) => {
  const navigate = useNavigate();

  const handleListingClick = (listing) => {
    // Navigate to separate page with the listing data
    navigate(`/file/${listing.fileName}`);
  };

  const closePopup = () => {
    // Close the popup
    // Implement this if necessary
  };

  return (
    <Dialog fullWidth open={true} onClose={closePopup}>
      <DialogTitle>Result</DialogTitle>
      <DialogContent>
        <Typography variant="h6" align="center">File Listing</Typography>
        <ul>
          {listings.map((listing, index) => (
            <li key={index}>
              <CustomButton
                variant="contained"
                color="primary"
                onClick={() => handleListingClick(listing)}
              >
                {listing.fileName}
              </CustomButton>
            </li>
          ))}
        </ul>
      </DialogContent>
      <DialogActions>
        <CustomButton onClick={closePopup}>Close</CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default PopupComponent;
