import React, { useState, useEffect } from 'react';
import { Typography, Box, Grid, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AdvancedResultsTabContent = ({ selectedTab, decodedBrandName, decodedDealershipName, decodedDepartment, decodedSubmission }) => {
  const [categoryResults, setCategoryResults] = useState([]);

  useEffect(() => {
    // Fetch results based on the selected category
    fetchCategoryResults();
  }, [selectedTab]);

  const fetchCategoryResults = () => {
    let categoryEndpoint = '';

    switch (selectedTab) {
      case 1:
        categoryEndpoint = `/get-logo-results/${encodeURIComponent(decodedBrandName)}/${encodeURIComponent(decodedDealershipName)}/${encodeURIComponent(decodedDepartment)}/${encodeURIComponent(decodedSubmission)}`;
        break;
      case 2:
        categoryEndpoint = `/get-car-results/${encodeURIComponent(decodedBrandName)}/${encodeURIComponent(decodedDealershipName)}/${encodeURIComponent(decodedDepartment)}/${encodeURIComponent(decodedSubmission)}`;
        break;
      case 3:
        categoryEndpoint = `/get-parking-results/${encodeURIComponent(decodedBrandName)}/${encodeURIComponent(decodedDealershipName)}/${encodeURIComponent(decodedDepartment)}/${encodeURIComponent(decodedSubmission)}`;
        break;
      case 4:
        categoryEndpoint = `/get-hospitality-results/${encodeURIComponent(decodedBrandName)}/${encodeURIComponent(decodedDealershipName)}/${encodeURIComponent(decodedDepartment)}/${encodeURIComponent(decodedSubmission)}`;
        break;
      case 5:
        categoryEndpoint = `/get-spatial-results/${encodeURIComponent(decodedBrandName)}/${encodeURIComponent(decodedDealershipName)}/${encodeURIComponent(decodedDepartment)}/${encodeURIComponent(decodedSubmission)}`;
        break;
      default:
        break;
    }

    if (categoryEndpoint) {
      fetch(categoryEndpoint)
        .then(response => response.json())
        .then(data => {
          setCategoryResults(data.images);
        })
        .catch(error => console.error(`Error fetching ${categoryEndpoint} results:`, error));
    }
  };

  return (
    <div style={{ display: 'flex', marginTop: '2rem' }}>
      {/* Content */}
      <div style={{ flex: 1 }}>
        <Typography variant="h6" align="center">Content</Typography>
        <Typography variant="body1" align="center">
          Description of the analysis goes here...
        </Typography>
      </div>
      <Divider orientation="vertical" flexItem />
      {/* Images */}
      <div style={{ flex: 1 }}>
        <Typography variant="h6" align="center">Images</Typography>
        {/* Render images in accordion */}
        {categoryResults.map((image, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`} id={`panel${index}-header`}>
              {`Image ${index + 1}`}
            </AccordionSummary>
            <AccordionDetails>
              <img src={image} alt={`Image ${index}`} style={{ maxWidth: '100%' }} />
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </div>
  );
};

export default AdvancedResultsTabContent;
