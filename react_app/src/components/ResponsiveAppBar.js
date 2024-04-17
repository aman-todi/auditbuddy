import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const categories = ['Overall', 'Logo', 'Cars', 'Parking', 'Hospitality', 'Spatial', 'Emotional'];

function ResponsiveAppBar({ handleTabChange }) {

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const handleMenuClick = (event, index) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    handleTabChange(index);
    setSelectedCategory(index); // Update selectedCategory
    setAnchorEl(null);
  };

  const handleTabItemClick = (index) => {
    handleTabChange(index);
    setSelectedCategory(index); // Update selectedCategory
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" style={{ backgroundColor: 'rgb(50, 50, 50)' }}>
      <Toolbar>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          aria-controls="responsive-menu"
          aria-haspopup="true"
          onClick={(event) => handleMenuClick(event, selectedCategory)} // Pass selectedCategory to handleMenuClick
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'rgb(245, 245, 245)' }}>
          {categories[selectedCategory].toUpperCase()}
        </Typography>
        <Menu
          id="responsive-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          {categories.map((category, index) => (
            <MenuItem key={category} onClick={(event) => handleMenuItemClick(event, index)}>
              {category}
            </MenuItem>
          ))}
        </Menu>
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          {categories.map((category, index) => (
            <Button key={category} color="inherit" onClick={() => handleTabItemClick(index)}>
              {category}
            </Button>
          ))}
        </Box>

      </Toolbar>
    </AppBar >
  );
}

export default ResponsiveAppBar;
