import React from 'react';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// custom button
export const CustomButton = (props) => {

    // styling
    const style = {
        // urban science green
        backgroundColor: '#74b42c'
    };

    return <Button variant="contained" style={style} {...props}/>;
};

//nav button
export const NavButton = (props) => {

    // styling
    const style = {
        // nav bar color
        backgroundColor: 'rgb(50,50,50)'
    };

    return <Button variant="filled" style={style} {...props}/>;
};

// custom nav bar
export default function NavBar() {

    // styling
    const style = {
        // grey
        backgroundColor:'rgb(50,50,50)'
    };

    return (
    <AppBar position='static' style={style}>
        <Toolbar>
            <Typography>
                Team Urban Science
            </Typography>
            <Typography sx={{flexGrow: 1}}>
            </Typography>
        <NavButton>HOME</NavButton>
        <NavButton>AUDIT</NavButton>
        <CustomButton>Login</CustomButton>
        </Toolbar>
    </AppBar>
    );
}