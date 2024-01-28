import React from 'react';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import {Link as RouterLink, useLocation, useNavigate, Link} from 'react-router-dom';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

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
    <AppBar position='sticky' style={style} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
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
    // find location of the current user
    const location = useLocation();
    const path = location.pathname;

    return (
        <Drawer variant='permanent'>
            <Toolbar sx={{marginTop: 7.5, width: 125}}>
                <List>
                    <ListItem>
                        <ListItemButton selected={path === '/audit'} component={Link} to="/audit">
                            <ListItemText primary="Dashboard" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton selected={path === '/audit/upload'} component={Link} to="/audit/upload">
                            <ListItemText primary="Upload"/>
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton selected={path === '/audit/results'} component={Link} to="/audit/results">
                            <ListItemText primary="Results" />
                        </ListItemButton>
                    </ListItem>
                    <Divider></Divider>
                    <ListItem>
                        <ListItemButton>
                            <ListItemText primary="Contact" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem>
                        <ListItemButton>
                            <ListItemText primary="Settings" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Toolbar>
        </Drawer >
    );
};