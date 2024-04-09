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
import { useAllResults } from './AllResultsContext';
import { jsPDF } from 'jspdf';
const categories = ['Overall', 'Logo', 'Cars', 'Parking', 'Hospitality', 'Spatial', 'Emotional'];

function ResponsiveAppBar({ handleTabChange }) {
  const { allResultText } = useAllResults();
  const { categoryImageData, overallScoreImageData } = useAllResults();
  const { brandName, dealershipName, department, submission, CategoryResultsData } = useAllResults();
  const dateObject = new Date(submission);

  const readableDate = dateObject.toLocaleDateString();
  const readableTime = dateObject.toLocaleTimeString();
  
  const DateTimeS = readableDate +", "+ readableTime

  const handleClick = () => {
    console.log(CategoryResultsData)
    console.log(allResultText);
    const doc = new jsPDF();
    const imageWidth = 100; // Width of image
    const imageHeight = 100; // Height of image
    const horizontalPadding = 1; // Padding between images
    const startX = 10; // X coordinate to start drawing images
    let textY = 10; // Y coordinate to start drawing text
    const maxTextWidth = doc.internal.pageSize.width - 20; // Max width for text

    // Add text variables
    const brandNameS = "Brand: " + brandName;
    const dealershipNameS = "Dealership: " + dealershipName;
    const departmentS = "Department: " + department;
    const submissionS = "Submission Date: " + DateTimeS;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); 

    // Add brand name
    const brandNameX = doc.internal.pageSize.width / 2;
    doc.text(brandNameS, brandNameX, textY, { align: "center" });

    // Add dealership name
    const dealershipNameX = doc.internal.pageSize.width / 2;
    doc.text(dealershipNameS, dealershipNameX, textY + 10, { align: "center" });

    // Add department
    const departmentX = doc.internal.pageSize.width / 2;
    doc.text(departmentS, departmentX, textY + 20, { align: "center" });

    // Add submission date
    const submissionX = doc.internal.pageSize.width / 2;
    doc.text(submissionS, submissionX, textY + 30, { align: "center" });

    // Add category chart image
    if (categoryImageData) {
      doc.addImage(categoryImageData, "PNG", startX, textY + 50, imageWidth, imageHeight);
    }

    if (overallScoreImageData) {
      const secondImageX = startX + imageWidth + horizontalPadding;

      doc.addImage(
        overallScoreImageData,
        "PNG",
        secondImageX,
        textY + 50,
        imageWidth,
        imageHeight
      );
    }

textY += 50 + imageHeight + 20; 
const textLines = doc.splitTextToSize(allResultText, maxTextWidth);
const firstTwentyLines = textLines.slice(0, 20);

const lineHeight = doc.getLineHeight() / doc.internal.scaleFactor;
const textHeight = firstTwentyLines.length * lineHeight;

const textCenterX = doc.internal.pageSize.width / 2;
const textLeftX = textCenterX - maxTextWidth / 2;

const textTopY = textY + (imageHeight - textHeight) / 2;

doc.text(firstTwentyLines, textLeftX, textTopY);

// Add new page
doc.addPage();

// Add space at the top of the text on the second page
textY = 10; // Reset y coordinate for new page
textY += 15;

// Add next lines of text on the second page
const nextHundredLines = textLines.slice(20, 75);
doc.text(nextHundredLines, textLeftX, textY);

// Add next page
doc.addPage();

// Add remaining text on the third page
const remainingText = textLines.slice(75);
doc.text(remainingText, textLeftX, textY);

    // Save the PDF
    doc.save("charts.pdf");
};
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
        <Button onClick={handleClick} style={{ color: '#74b42c'}}>
    Download PDF
      </Button>
      </Toolbar>
    </AppBar >
  );
}

export default ResponsiveAppBar;
