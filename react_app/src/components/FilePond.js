import React, { useState, useEffect } from 'react';
import { FilePond } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import * as MaterialUI from './MaterialUI';
import axios from 'axios';

const FilePondImageImport = () => {
    // states to keep track of file
    const [file, setFile] = useState(null);
  
    const handleFileAdded = (fileItems) => {
        if (fileItems.length > 0)
        {
            // set the state of file
            setFile(fileItems[0].file)
        }
    };

    const handleUpload = async () => {
        if (file) 
        {
            // create a form and append this file
            const formData = new FormData();
            formData.append('file', file);
            
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
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error message:', error.message);
                    alert('Error uploading file');
                }
            }
        }
      };

    return (
      <div>
        <FilePond
          allowMultiple={false}
          onupdatefiles={handleFileAdded}
        />
        <MaterialUI.CustomButton onClick={handleUpload} >Upload Image</MaterialUI.CustomButton>
      </div>
    );
  };
  
  export default FilePondImageImport;