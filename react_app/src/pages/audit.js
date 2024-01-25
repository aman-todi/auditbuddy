import React, { useState, useRef } from 'react';
import '../App.css';
import $ from 'jquery';
import axios from 'axios';
import * as MaterialUI from '../MaterialUI';

// Define a function for Importing Videos called VideoImportButton
function VideoImportButton() {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileName, setFileName] = useState(''); // State to store the file name
  
    const handleFileChange = (event) => {
      setSelectedFile(event.target.files[0]);
      setFileName(event.target.files[0] ? event.target.files[0].name : ''); // Update the file name
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
            setFileName(''); // Reset the file name after successful upload
            setSelectedFile(null); // Reset the selected file as well
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
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
                alert('Error uploading file');
            }
        }
    };
  
    return (
      <div>
          <input type="file" onChange={handleFileChange} ref={fileInputRef} style={{ display: 'none' }} />
          <MaterialUI.CustomButton onClick={() => fileInputRef.current.click()}>Select Video</MaterialUI.CustomButton>
          <br></br>
          <MaterialUI.CustomButton variant="contained" onClick={handleUpload}>Upload Video</MaterialUI.CustomButton>
          {fileName && <div className="file-name-box">Selected file: {fileName}</div>}
      </div>
    );
  }
  
  // example ajax request
  function RequestButton() {
    return (
      <MaterialUI.CustomButton variant="contained" onClick={Request}>
        send a request
      </MaterialUI.CustomButton>
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

function AuditPage () {
    return (
        <React.Fragment>
        <div className="App">
            <header className="App-header">
            <p>
                Upload Media
            </p>
        <VideoImportButton />
    <br></br>
  {/*<RequestButton />
  <p id="request"></p>*/}

        </header>
        </div>
        </React.Fragment>
    );
}

export default AuditPage;