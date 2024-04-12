import React, { useState, useEffect, useRef } from 'react';
import { Typography, Box, Divider, Accordion, AccordionSummary, AccordionDetails, useTheme, useMediaQuery } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Chart from 'chart.js/auto'; // Import Chart.js library
import axios from 'axios';
import { jsPDF } from 'jspdf';
import { useAllResults } from './AllResultsContext';
import html2canvas from 'html2canvas'; // Import html2canvas library

const AdvancedResultsTabContent = ({ selectedTab, brandName, dealershipName, department, submission }) => {
  const [categoryResults, setCategoryResults] = useState(null);
  const [gradeResults, setGradeResults] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryScores, setCategoryScores] = useState([]);
  const [totalScore, setTotalScore] = useState('');
  const [detection, setDetection] = useState([]);
  const [expectedValueRange, setExpectedValueRange] = useState([]);
  const [expectedLogo, setExpectedLogo] = useState('');
  const { setAllResultText } = useAllResults();
  const tab = selectedTab ?? 0;
  const { setCategoryResultsData, setCategoryImageData, setOverallScoreImageData, setbrandName, setdealershipName, setdepartment, setsubmission, setEmoji, setTScore} = useAllResults();

  useEffect(() => {
    console.log(categoryResults);
    setCategoryResultsData(categoryResults)
  }, [categoryResults]);
  setbrandName(brandName)
  setdealershipName(dealershipName)
  setdepartment(department)
  setsubmission(submission)
  setTScore(totalScore)
  const exportToPDF = () => {
    const doc = new jsPDF();
    const promises = [];

    promises.push(
      new Promise((resolve) => {
        html2canvas(document.getElementById('categoryChart')).then((canvas) => {
          const imageData = canvas.toDataURL('image/png');
          setCategoryImageData(imageData); 
          resolve();
        });
      })
    );

    // Capture overall score chart as image
    promises.push(
      new Promise((resolve) => {
        html2canvas(document.getElementById('overallScoreChart')).then((canvas) => {
          const imageData = canvas.toDataURL('image/png');
          setOverallScoreImageData(imageData); 
          resolve();
        });
      })
    );

    Promise.all(promises).then(() => {
    });
  };


  const generateResultTextForTab1 = (t) => {
    const keys = Object.keys(expectedValueRange);
    if (keys.length > 0) {
        if (t !== 0 && gradeResults) {
            return `Category Score: ${categoryScores[t - 1]} out of 4\n
Detected Value: ${detection[t - 1]}
${tab !== 1 ? `
Expected Value Range:
Minimum: ${expectedValueRange[categories[t - 1]][0]}
Above Minimum: ${expectedValueRange[categories[t - 1]][1]}
Well Over Minimum: ${expectedValueRange[categories[t - 1]][2]}\n
` : `
Expected Value:${expectedLogo}`}Based on the analysis, here's how the results are interpreted: ${
categoryScores[t - 1] === 1 ? `
The detected value falls below the minimum dealership standard. Improvement is needed.
` : categoryScores[t - 1] === 2 ? `
The detected value is slightly below the expected standard. Consider making adjustments for better performance.
` : categoryScores[t - 1] === 3 ? `
The detected value meets or slightly exceeds the expected standard. This is a satisfactory result.
` : categoryScores[t - 1] === 4 ? `
The detected value significantly exceeds the expected standard. Congratulations on achieving an excellent result.
` : ``}`;
        }
    } else {
        return '';
    }
};


  let allResultText = '';
  const tabNames = ['Logo', 'Cars', 'Parking', 'Hospitality', 'Spatial', 'Emotional'];
  const categoryResultsData = [];

  for (let t = 1; t <= 6; t++) {
    const resultTextForTab = generateResultTextForTab1(t);
    allResultText += tabNames[t - 1] + '\n' + resultTextForTab + '\n\n'; 


  }
  console.log(categoryResultsData)
  exportToPDF();
  setAllResultText(allResultText);

  console.log("Tab Selected", tab)

  const categoryChartRef = useRef(null);
  const overallScoreChartRef = useRef(null);

  const handleSetGradeResults = (data) => {
    setGradeResults(data);
  };

  useEffect(() => {
    const fetchData = async (submission, dealershipName, department) => {
      try {
        if (submission && dealershipName && department) {
          // Fetch grade results
          const formData = new FormData();
          formData.append('submission', submission);
          formData.append('name', dealershipName);
          formData.append('department', department);

          const gradeResponse = await axios.post('/get-category-eval', formData, {
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
            case 6:
              categoryEndpoint = `/get-emotional-results/${encodeURIComponent(brandName)}/${encodeURIComponent(dealershipName)}/${encodeURIComponent(department)}/${encodeURIComponent(submission)}`;
              break;
            default:
              break;
          }

          if (categoryEndpoint) {
            const categoryResponse = await fetch(categoryEndpoint);
            const categoryData = await categoryResponse.json();
            setCategoryResults(categoryData.images);
          }
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
            backgroundColor: '#74b42c',
            borderColor: '#f5f5f5',
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
    const scorePercentage = (totalScore / 24) * 100;
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
            data: [totalScore, 24 - totalScore],
            backgroundColor: ['#74b42c', 'rgb(165,156,148)'],
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
  const MyComponent = ({ score }) => {
    let emoji;

    switch (score) {
      case 1:
        emoji = String.fromCodePoint(0x1F641); // 🙁
        break;
      case 2:
        emoji = String.fromCodePoint(0x1F615); // 😕
        break;
      case 3:
        emoji = String.fromCodePoint(0x1F642); // 🙂
        break;
      case 4:
        emoji = String.fromCodePoint(0x1F601); // 😁
        break;
      default:
        emoji = '';
    }
    setEmoji(emoji)

    const emojiStyle = {
      fontSize: '3em', // Adjust the font size as needed
      marginTop: '0.5rem' // Adjust the top margin to provide space between text and emoji
    };

    return (
      <div style={{ textAlign: 'center' }}>
        <Typography variant="body1" align="center">
          Emotional Detection:
        </Typography>
        <span style={emojiStyle}>{emoji}</span>
      </div>
    );
  };


  console.log("Testing indexing", expectedValueRange[tab - 1]);

  // for mobile responsiveness
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', flexDirection: isMobile ? 'column' : 'row', flex: 1 }}>

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
                Overall Score: {totalScore} / 23
              </Typography>
              <MyComponent score={categoryScores[5]} />
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flex: 1 }}>
                <div style={{ flex: 1, marginBottom: isMobile ? '1rem' : '0' }}>
                  <canvas id="categoryChart" width="50%" height="50%"></canvas>
                </div>
                {isMobile ? null : <Divider orientation="vertical" flexItem />}
                <div style={{ flex: 1 }}>
                  <canvas id="overallScoreChart" ></canvas>
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
