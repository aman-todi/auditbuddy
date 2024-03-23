import React, { useState, useEffect, useRef } from 'react';
import { Typography, Box, Divider, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chart from 'chart.js/auto'; // Import Chart.js library
import axios from 'axios';

const AdvancedResultsTabContent = ({ selectedTab, brandName, dealershipName, department, submission }) => {
  const [categoryResults, setCategoryResults] = useState(null);
  const [gradeResults, setGradeResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryScores, setCategoryScores] = useState([]);
  const [totalScore, setTotalScore] = useState('');
  const [detection, setDetection] = useState([]);
  const [expectedValueRange, setExpectedValueRange] = useState([]);
  const [expectedLogo, setExpectedLogo] = useState('');

  const tab = selectedTab ?? 0;
  console.log("Tab Selected", tab)

  const categoryChartRef = useRef(null);
  const overallScoreChartRef = useRef(null);

  const handleSetGradeResults = (data) => {
    setGradeResults(data);
  };

  useEffect(() => {
    const fetchData = async (submission, dealershipName, department) => {
      try {
        // Fetch grade results
        const formData = new FormData();
        formData.append('submission', submission);
        formData.append('name', dealershipName);
        formData.append('department', department);

        const gradeResponse = await axios.post('http://localhost:8080/get-category-eval', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // Set grade results
        handleSetGradeResults(gradeResponse.data);
        setCategories(gradeResponse.data["Category Eval"]["Categories"]);
        setCategoryScores(gradeResponse.data["Category Eval"]["Scores"]);
        setTotalScore(gradeResponse.data["Overall Eval"]["Scores"]);
        setDetection(gradeResponse.data["Detection"]);
        setExpectedValueRange(gradeResponse.data["Min Vals"]);
        setExpectedLogo(gradeResponse.data["Expected Logo"])
        renderCategoryGraphs(gradeResponse.data["Category Eval"]["Categories"], gradeResponse.data["Category Eval"]["Scores"]);
        renderOverallScorePieChart(gradeResponse.data["Overall Eval"]["Scores"]);

        // Fetch category results
        let categoryEndpoint = '';

        switch (tab) {
          case 1:
            categoryEndpoint = `/get-logo-results/${encodeURIComponent(brandName)}/${encodeURIComponent(dealershipName)}/${encodeURIComponent(department)}/${encodeURIComponent(submission)}`;
            break;
          case 2:
            categoryEndpoint = `/get-car-results/${encodeURIComponent(brandName)}/${encodeURIComponent(dealershipName)}/${encodeURIComponent(department)}/${encodeURIComponent(submission)}`;
            break;
          case 3:
            categoryEndpoint = `/get-parking-results/${encodeURIComponent(brandName)}/${encodeURIComponent(dealershipName)}/${encodeURIComponent(department)}/${encodeURIComponent(submission)}`;
            break;
          case 4:
            categoryEndpoint = `/get-hospitality-results/${encodeURIComponent(brandName)}/${encodeURIComponent(dealershipName)}/${encodeURIComponent(department)}/${encodeURIComponent(submission)}`;
            break;
          case 5:
            categoryEndpoint = `/get-spatial-results/${encodeURIComponent(brandName)}/${encodeURIComponent(dealershipName)}/${encodeURIComponent(department)}/${encodeURIComponent(submission)}`;
            break;
          default:
            break;
        }

        if (categoryEndpoint) {
          const categoryResponse = await fetch(categoryEndpoint);
          const categoryData = await categoryResponse.json();
          setCategoryResults(categoryData.images);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData(submission, dealershipName, department);
  }, [tab, submission, dealershipName, department]); // Fetch data whenever the tab changes

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
    const scorePercentage = (totalScore / 20) * 100;
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
            data: [totalScore, 20 - totalScore],
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

  console.log("Testing indexing", expectedValueRange[tab - 1]);

  return (
    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center' }}>

      <>
        {tab !== 0 && gradeResults && (
          <div style={{ flex: 1 }}>
            <Typography variant="body1" align="left">
              <strong>Category Score:</strong> {categoryScores[tab - 1]} out of 4
            </Typography>
            <Typography variant="body1" align="left">
              <strong>Detected Value:</strong> {detection[tab - 1]}
            </Typography>
            {tab !== 1 ? (
              <Typography variant="body1" align="left">
                <strong>Expected Value Range:</strong>
                <ul>
                  <li>
                    <strong>Minimum:</strong> {expectedValueRange[categories[tab - 1]][0]}
                  </li>
                  <li>
                    <strong>Above Minimum:</strong> {expectedValueRange[categories[tab - 1]][1]}
                  </li>
                  <li>
                    <strong>Well Over Minimum:</strong> {expectedValueRange[categories[tab - 1]][2]}
                  </li>
                </ul>
              </Typography>
            ) : (
              <Typography variant="body1" align="left" style={{ marginBottom: '2rem' }}>
                <strong>Expected Value:</strong> {expectedLogo}
              </Typography>
            )}

            <Typography variant="body1" align="left" style={{ marginBottom: '1rem' }}>
              Based on the analysis, here's how the results are interpreted:
            </Typography>
            {categoryScores[tab - 1] === 1 && (
              <Typography variant="body1" align="left">
                The detected value falls below the minimum dealership standard. Improvement is needed.
              </Typography>
            )}
            {categoryScores[tab - 1] === 2 && (
              <Typography variant="body1" align="left">
                The detected value is slightly below the expected standard. Consider making adjustments for better performance.
              </Typography>
            )}
            {categoryScores[tab - 1] === 3 && (
              <Typography variant="body1" align="left">
                The detected value meets or slightly exceeds the expected standard. This is a satisfactory result.
              </Typography>
            )}
            {categoryScores[tab - 1] === 4 && (
              <Typography variant="body1" align="left">
                The detected value significantly exceeds the expected standard. Congratulations on achieving an excellent result.
              </Typography>
            )}
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
                Overall Score: {totalScore} / 20
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
    </div >
  );

};

export default AdvancedResultsTabContent;
