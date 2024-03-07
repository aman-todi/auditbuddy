import React, {useState} from 'react';
import {TextField, Container, Box, Alert} from '@mui/material/';
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
    
            // redirect to the audit page after 1 second
            let countdown = 1;
            setInterval(() => {
              if (countdown === 0) 
              {
                navigate('/audit');
              }
              else
              {
                setError('Login successful');
              }
              countdown -= 1;
          }, 1000);

        }).catch((error) => {
            console.log(error);
            setError(error.message);
        })
    };

    const handleOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = () => {
        console.log(passEmail)
        const auth = getAuth();
        sendPasswordResetEmail(auth, passEmail)
          .then(() => {
            console.log("sucessful")
          })
          .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
          });
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
                {error ? (
                    <Alert severity={error === 'Login successful' ? 'success' : 'error'}>
                        {error}
                    </Alert>
                ) : null}
            </Box>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Forgot Password</DialogTitle>
                <DialogContent>
                <TextField
                    sx={{ marginTop: .5}}
                    label="Email Address"
                    type="email"
                    fullWidth
                    value={passEmail}
                    onChange={(e) => setPassEmail(e.target.value)}
                />
                <Button onClick={handleSubmit}>
                    Submit
                </Button>
                <Button onClick={handleClose}>
                    Cancel
                </Button>
                </DialogContent>
            </Dialog>
        </Container>
        </header>
        </React.Fragment>
    );
}

export default LoginPage;