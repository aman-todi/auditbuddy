import React, { useState, useEffect, useRef } from 'react';
import { Typography, Box, Divider, CircularProgress, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chart from 'chart.js/auto'; // Import Chart.js library
import axios from 'axios';

const AdvancedResultsTabContent = ({ selectedTab, decodedBrandName, decodedDealershipName, decodedDepartment, decodedSubmission }) => {
  const [categoryResults, setCategoryResults] = useState(null);
  const [gradeResults, setGradeResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryScores, setCategoryScores] = useState([]);
  const [totalScore, setTotalScore] = useState('');
  const [detection, setDetection] = useState([]);
  const [loading, setLoading] = useState(true);


  const tab = selectedTab ?? 0;
  console.log("Tab Selected", tab)

  const categoryChartRef = useRef(null);
  const overallScoreChartRef = useRef(null);

  const handleSetGradeResults = (data) => {
    setGradeResults(data);
  };

  // function to get the category eval
  const fetchGradeResults = async (decodedSubmission, decodedDealershipName, decodedDepartment) => {
    try {
      // append to a form the dealership submission, name, department
      // create a form and append this file
      const formData = new FormData();

      // extract information from dealership
      formData.append('submission', decodedSubmission);
      formData.append('name', decodedDealershipName);
      formData.append('department', decodedDepartment);

      const response = await axios.post('http://localhost:8080/get-category-eval', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      handleSetGradeResults(response.data);
      console.log(response.data);

      setCategories(response.data["Category Eval"]["Categories"]);
      setCategoryScores(response.data["Category Eval"]["Scores"]);
      setTotalScore(response.data["Overall Eval"]["Scores"]);
      setDetection(response.data["Detection"])

      renderCategoryGraphs(response.data["Category Eval"]["Categories"], response.data["Category Eval"]["Scores"]);
      renderOverallScorePieChart(response.data["Overall Eval"]["Scores"]);
    } catch (error) {
      console.error('Error fetching the category eval', error);
    }
  };

  useEffect(() => {
    fetchCategoryResults();
    fetchGradeResults(decodedSubmission, decodedDealershipName, decodedDepartment);
  }, [tab]);

  const renderCategoryGraphs = (categories, scores) => {
    console.log("scores in graph", scores);
    if (scores.length === 0) {
      return;
    }
    if (categoryChartRef.current) {
      categoryChartRef.current.destroy(); // Destroy previous instance
    }

    // Render the chart only if the canvas element exists
    const categoryChartCanvas = document.getElementById('categoryChart');
    if (categoryChartCanvas) {
      const ctx = categoryChartCanvas.getContext('2d'); // Get 2D context
      new Chart(ctx, {
        type: 'bar',
        position: "absolute",
        data: {
          labels: categories,
          datasets: [{
            label: 'Scores',
            data: scores,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            x: {
              title: {
                display: true,
                text: 'Categories'
              }
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Scores'
              }
            }
          },
          plugins: {
            title: {
              display: true,
              text: 'Evaluation Grades by Category'
            }
          }
        }
      });
    }
  };

  const renderOverallScorePieChart = (totalScore) => {
    console.log("total in graph", totalScore);
    if (!totalScore) {
      return;
    }
    if (overallScoreChartRef.current) {
      overallScoreChartRef.current.destroy(); // Destroy previous instance
    }

    // Calculate percentage for each value
    const scorePercentage = (totalScore / 16) * 100;
    const remainingPercentage = 100 - scorePercentage;

    // Render the chart only if the canvas element exists
    const overallScoreCanvas = document.getElementById('overallScoreChart');
    if (overallScoreCanvas) {
      const ctx = overallScoreCanvas.getContext('2d'); // Get 2D context
      new Chart(ctx, {
        type: 'pie',
        position: "absolute",
        data: {
          labels: ['Score', 'Remaining'],
          datasets: [{
            data: [totalScore, 16 - totalScore],
            backgroundColor: ['#467be3', '#e9edf7'],
            vals: [scorePercentage, remainingPercentage]
          }]
        },
        options: {
          plugins: {
            legend: {
              labels: {
                generateLabels: function (chart) {
                  const data = chart.data;
                  if (data.labels.length && data.datasets.length) {
                    return data.labels.map((label, i) => {
                      const value = data.datasets[0].vals[i];
                      return {
                        text: `${label} (${value.toFixed(2)}%)`, // Display percentage with two decimal places
                        fillStyle: data.datasets[0].backgroundColor[i],
                        strokeStyle: 'transparent',
                        lineWidth: 2,
                        hidden: isNaN(value), // Hide if the value is NaN
                        index: i
                      };
                    });
                  }
                  return [];
                }
              }
            },
            title: {
              display: true,
              text: 'Overall Score'
            }
          }
        }
      });
    }
  };


  const fetchCategoryResults = () => {
    let categoryEndpoint = '';

    switch (tab) {
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
        setLoading(false);
        break;
    }

    if (categoryEndpoint) {
      setLoading(true); // Set loading to true before fetching data
      fetch(categoryEndpoint)
        .then(response => response.json())
        .then(data => {
          setCategoryResults(data.images);
        })
        .catch(error => console.error(`Error fetching ${categoryEndpoint} results:`, error))
        .finally(() => {
          setLoading(false); // Set loading to false when data fetching completes
          console.log("What it set Endpoint", loading);
        });
    }

  };

  console.log("Category Results", categoryResults);
  console.log("Loading Value", loading);
  return (
    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>
      {loading ? (
        <CircularProgress color="success" />
      ) : (
        <>
          {tab !== 0 && gradeResults && (
            <div style={{ flex: 1 }}>
              <Typography variant="h6" align="center">Content</Typography>
              <Box>
                <Typography variant="body1" align="center">
                  Category Score: {categoryScores[tab - 1]}
                </Typography>
                <Typography variant="body1" align="center">
                  Detected Value: {detection[tab - 1]}
                </Typography>
              </Box>
            </div>
          )}
          {tab !== 0 ? (
            <div style={{ flex: 1 }}>
              <Typography variant="h6" align="center">Images</Typography>
              {categoryResults && categoryResults.map((image, index) => (
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
          ) : (
            <>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginBottom: '2rem' }}>
                <Typography variant="h6" align="center">Evaluation Graphs</Typography>
                <Typography variant="body1" align="center">
                  Overall Score: {totalScore}
                </Typography>
                <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
                  <div style={{ flex: 1 }}>
                    <canvas id="categoryChart" width="300" height="300"></canvas>
                  </div>
                  <Divider orientation="vertical" flexItem />
                  <div style={{ flex: 1 }}>
                    <canvas id="overallScoreChart" width="300" height="300"></canvas>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )
      }
    </div >
  );

};

export default AdvancedResultsTabContent;
