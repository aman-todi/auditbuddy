import React from 'react';
import {TextField, Container, Box} from '@mui/material/';
import * as MaterialUI from '../components/MaterialUI';

function LoginPage() {
    return (
        <React.Fragment>
        <header className="App-header">
        <div className="App">
            <h1>Login</h1>
        </div>
        <Container component= "main" maxWidth="xs">
            <Box sx={{display: "flex", flexDirection: "column"}}>
                <TextField fullWidth required label='Email' variant="outlined" margin="normal"/>
                <TextField fullWidth required label='Password' variant="outlined" margin="normal" type="password"/>
                <MaterialUI.CustomButton type ="submit">Login</MaterialUI.CustomButton>
            </Box>
        </Container>
        </header>
        </React.Fragment>
    );
}

export default LoginPage;