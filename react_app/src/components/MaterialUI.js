import React from 'react';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import {Link as RouterLink} from 'react-router-dom';

// custom button
export const CustomButton = (props) => {

    // styling
    const style = {
        // urban science green
        backgroundColor: '#74b42c'
    };

    return <Button variant="contained" style={style} {...props}/>;
};

//nav link
export const NavLink = (props) => {
    // styling
    const style = {
        // nav link styling
        textDecoration: 'none',
        color: 'rgb(245,245,245)'
    };

    return (
        <RouterLink style={style} {...props} />
    );
};

//nav button
export const NavButton = (props) => {

    // styling
    const style = {
        // nav bar color
        backgroundColor: 'rgb(50,50,50)'
    };

    return (
    <Button variant="filled" style={style} {...props}/>
    );
};

// custom nav bar
export const NavBar = (props) => {

    // styling
    const style = {
        // grey
        backgroundColor:'rgb(50,50,50)'
    };

    return (
    <AppBar position='sticky' style={style}>
        <Toolbar>
            <Typography>
                Team Urban Science
            </Typography>
            <Typography sx={{flexGrow: 1}}>
            </Typography>
        <NavButton><NavLink to="/">Home</NavLink></NavButton>
        <NavButton><NavLink to="/audit">Audit</NavLink></NavButton>
        <CustomButton><NavLink to="/login">Login</NavLink></CustomButton>
        </Toolbar>
    </AppBar>
    );
};

export const SideBar = (props) => {
    return (
        <Drawer variant='permanent' sx={{flexGrow: 1}}>
            <Toolbar>
                <Typography>
                Team Urban Science
                </Typography>
                <List>
                </List>
            </Toolbar>
        </Drawer >
    );
};