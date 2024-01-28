import React, { useState} from 'react';
import '../App.css';
// filepond
import { FilePond} from 'react-filepond';
import 'filepond/dist/filepond.min.css';
// material ui
import * as MaterialUI from './MaterialUI';
import { InputLabel, FormControl, FormHelperText, MenuItem, Select } from '@mui/material/';
// axios
import axios from 'axios';

const FormImport = (props) => {
    // states to keep track of file and form
    const [file, setFile] = useState(null);
    const [department, setDepartment] = useState('');
    
    const handleFileAdded = (fileItems) => {
        if (fileItems.length > 0)
        {
            // set the state of file
            setFile(fileItems[0].file)
        }
    };

    const handleDepartmentAdded = (event) => {
        setDepartment(event.target.value);
    };

    const handleUpload = async () => {
        // form validation
        if (department == '') {
            alert('Please select a department')
        }
        else if (!file) {
            alert('Please select a file')
        }
        else
        {
            // create a form and append this file
            // single image
            const formData = new FormData();
            formData.append('file', file);
            // department
            formData.append('department', department);
            
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
        <FormControl required sx={{minWidth: 150}}>
        <InputLabel>Department</InputLabel>
        <Select
        value = {department}
        label = "Department"
        onChange={handleDepartmentAdded}
        >
            <MenuItem value={"service"}>Service</MenuItem>
            <MenuItem value={"sales"}>Sales</MenuItem>
            <MenuItem value={"parts"}>Parts</MenuItem>
            <MenuItem value = {"bodyandpaint"}>Body & Paint</MenuItem>
        </Select>
        <FormHelperText>Required</FormHelperText>
        </FormControl>
        <FilePond
            allowMultiple={false}
            onupdatefiles={handleFileAdded}
        />
        <MaterialUI.CustomButton type ="submit" onClick={handleUpload}>Analyze</MaterialUI.CustomButton>
      </div>
    );
  };
  
  export default FormImport;