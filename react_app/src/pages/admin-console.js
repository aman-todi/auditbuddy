import React, {useState, useEffect} from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import {TextField, Container, Box, Typography, Tooltip} from '@mui/material/';
import HelpIcon from '@mui/icons-material/Help';
import { auth } from '../components/Authentication';
import axios from 'axios';

function AdminPage () {

  // page authentication
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => setUser(currentUser));
  }, []);

  // keep track of states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState(null);

  // create user function
  const createUser = async () => {

    if (password != confirm)
    {
      setError("Passwords do not match");
    }
    else {
        // create a form and append this file
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        try {
          const response = await axios.post('http://localhost:8080/create-user', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          setError(`User created successfully: ${response.data.email}`);
        }
        catch (error) {
          if (error.response) 
          {
            setError(`Error creating user: ${error.response.data.error}`);
          } 
          else if (error.request) 
          {
            setError('Error creating user: No response from server');
          } 
          else 
          {
            setError('Error creating user');
          }
        }
    }
};

    return (
        <React.Fragment>
        {user ? 
        (
          <React.Fragment>
          <MaterialUI.SideBar></MaterialUI.SideBar>
          <header className="App-header" style={{marginLeft: 125}}>
          <div className="App">
              <h1>Admin Console</h1>
              <Container component= "main" maxWidth="s">
              <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Create User</span>
              <Tooltip disableFocusListener title="The information of the user you want to create">
                <HelpIcon sx={{ fontSize: "small" }} />
              </Tooltip>
              </Typography>

              <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center" }}>
              <TextField  sx={{ margin: "0.1rem", width:"15vw"}} fullWidth value = {email} onChange={(e) => setEmail(e.target.value)} required id="email" label='Email' variant="outlined" margin="normal"/>
              <TextField  sx={{ margin: "0.1rem", width:"15vw"}} fullWidth value = {password} onChange={(e) => setPassword(e.target.value)} required id="password" label='Password' variant="outlined" margin="normal" type="password"/>
              <TextField  sx={{ margin: "0.1rem", width:"15vw"}} fullWidth value = {confirm} onChange={(e) => setConfirm(e.target.value)} required id="confirm" label='Confirm Password' variant="outlined" margin="normal" type="password"/>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0.1rem" }}>
              <MaterialUI.CustomButton type ="submit" onClick={createUser}>Create User</MaterialUI.CustomButton>
              {error && <p id="error">{error}</p>}
              </Box>
              </Container>
          </div>
          </header>
            </React.Fragment>
          ) : (<p>Not Authorized</p>)
        }
        </React.Fragment>
    );
}

export default AdminPage;