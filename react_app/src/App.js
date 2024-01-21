import React, { useState, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import $ from 'jquery';
import axios from 'axios';


// Define a function for Importing Videos called VideoImportButton
function VideoImportButton() {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
      if (!selectedFile) {
          alert('Please select a file to upload.');
          return;
      }

      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
          const response = await axios.post('http://localhost:8080/upload-video', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          });
          alert(`File uploaded successfully: ${response.data.filename}`);
      } 
      catch (error) {
          if (error.response) {
              // The request was made and the server responded with a status code
              // that falls out of the range of 2xx
              console.error('Error response:', error.response.data);
              alert(`Error uploading file: ${error.response.data.error}`);
          } else if (error.request) {
              // The request was made but no response was received
              console.error('Error request:', error.request);
              alert('Error uploading file: No response from server');
          } else {
              // Something happened in setting up the request that triggered an error
              console.error('Error message:', error.message);
              alert('Error uploading file');
          }
      }
  };

  return (
      <div>
          <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
          <button onClick={() => fileInputRef.current.click()}>Select Video</button>
          <button onClick={handleUpload}>Upload Video</button>
      </div>
  );
}

// example function
function Test() {
  document.getElementById("test").innerText = "this button does something";
}

// example ajax request
function RequestButton() {
  return (
    <button onClick={Request}>
      send a request
    </button>
  );
}
function Request() {
  $.ajax({
    url: "/test",
    type: "GET",
    success: function (returned_data) {
      document.getElementById("request").innerText = returned_data.test
    }
  });
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Team Urban Science
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>

        <VideoImportButton />
        <p id="test"></p>
        <RequestButton />
        <p id="request"></p>


      </header>
    </div>
  );
}

export default App;
