import React, {useState} from 'react';
import {TextField, Container, Box} from '@mui/material/';
import * as MaterialUI from '../components/MaterialUI';
import { useNavigate } from 'react-router-dom';
import { auth } from '../components/Authentication';
import { signInWithEmailAndPassword } from 'firebase/auth';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // sign in function
    const signIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) =>{
            console.log(userCredential);
    
            // redirect to the audit page after 3 seconds
            let countdown = 3;
            setInterval(() => {
              if (countdown === 0) 
              {
                navigate('/audit');
              }
              else
              {
                setError(`Login successful. Redirecting in ${countdown} seconds`);
              }
              countdown -= 1;
          }, 1000);

        }).catch((error) => {
            console.log(error);
            setError(error.message);
        })
    };

    return (
        <React.Fragment>
        <header className="App-header">
        <div className="App">
            <h1>Login</h1>
        </div>
        <Container component= "main" maxWidth="xs">
            <Box sx={{display: "flex", flexDirection: "column"}}>
                <TextField fullWidth value = {email} onChange={(e) => setEmail(e.target.value)} required id="email" label='Email' variant="outlined" margin="normal"/>
                <TextField fullWidth value = {password} onChange={(e) => setPassword(e.target.value)} required id="password" label='Password' variant="outlined" margin="normal" type="password"/>
                <MaterialUI.CustomButton type ="submit" onClick={signIn}>Login</MaterialUI.CustomButton>
                {error && <p id="error">{error}</p>}
            </Box>
        </Container>
        </header>
        </React.Fragment>
    );
}

export default LoginPage;