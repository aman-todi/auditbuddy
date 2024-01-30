import React, { useState} from 'react';
import '../App.css';
// filepond
import { FilePond} from 'react-filepond';
import 'filepond/dist/filepond.min.css';
// material ui
import * as MaterialUI from './MaterialUI';
import { InputLabel, FormControl, MenuItem, Select, TextField, Container, Box} from '@mui/material/';
// axios
import axios from 'axios';

const FormImport = (props) => {
    // states to keep track of file and form
    const [file, setFile] = useState(null);
    const [department, setDepartment] = useState('');
    const [country, setCountry] = useState('');
    const [dealership, setDealership] = useState('');
    const [name, setName] = useState('');
    
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

    const handleCountryAdded = (event) => {
        setCountry(event.target.value)
    }

    const handleDealershipAdded = (event) => {
        setDealership(event.target.value)
    }

    const handleNameAdded = (event) => {
        setName(event.target.value)
    }

    const handleUpload = async () => {
        // form validation
        if (name === '') {
            alert('Please enter the dealership name')
        }
        else if (dealership === '') {
            alert('Please select a dealership')
        }
        else if (department === '') {
            alert('Please select a department')
        }
        else if (country === '') {
            alert('Please select a country')
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
            // name
            formData.append('name', name);
            // department
            formData.append('department', department);
            // country
            formData.append('country', country)
            // dealership
            formData.append('dealership', dealership)
            
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
    <Container component="main" maxWidth="s">
      <Box sx={{display: "flex",  flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center"}}>
        <TextField fullWidth required label="Dealership Name" variant="outlined" onChange={handleNameAdded}
        />
        <FormControl required fullWidth>
        <InputLabel>Dealership</InputLabel>
        <Select
        value = {dealership}
        label = "Dealership"
        onChange={handleDealershipAdded}
        >
            <MenuItem value={"audi"}>Audi</MenuItem>
            <MenuItem value={"bmw"}>BMW</MenuItem>
            <MenuItem value={"cadillac"}>Cadillac</MenuItem>
            <MenuItem value={"chevrolet"}>Chevrolet</MenuItem>
            <MenuItem value={"ford"}>Ford</MenuItem>
            <MenuItem value={"honda"}>Honda</MenuItem>
            <MenuItem value={"kia"}>Kia</MenuItem>
            <MenuItem value={"nissan"}>Nissan</MenuItem>
            <MenuItem value={"subaru"}>Subaru</MenuItem>
            <MenuItem value={"toyota"}>Toyota</MenuItem>
            <MenuItem value={"volkswagen"}>Volkswagen</MenuItem>
        </Select>
        </FormControl>
        <FormControl required fullWidth>
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
        </FormControl>
        <FormControl required fullWidth>
        <InputLabel>Country</InputLabel>
        <Select
        value = {country}
        label = "Country"
        onChange={handleCountryAdded}
        >
            <MenuItem value={"usa"}>USA</MenuItem>
            <MenuItem value={"canada"}>Canada</MenuItem>
        </Select>
        </FormControl>
        </Box>
        <Box sx={{marginTop: 2}}>
        <FilePond
            allowMultiple={false}
            onupdatefiles={handleFileAdded}
        />
        </Box>
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <MaterialUI.CustomButton type ="submit" onClick={handleUpload}>Analyze</MaterialUI.CustomButton>
        </Box>
      </Container>
    );
  };
  
  export default FormImport;