import React, { useState, useEffect } from 'react';
// navbar/sidebar
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useLocation, Link, useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
// authentication
import { auth } from '../components/Authentication';

// custom button
export const CustomButton = (props) => {

    // styling
    const style = {
        // urban science green
        backgroundColor: '#74b42c'
    };

    return <Button variant="contained" style={style} {...props} />;
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
        <Button variant="filled" style={style} {...props} />
    );
};

// custom nav bar
export const NavBar = (props) => {

    const navigate = useNavigate();

    // styling
    const style = {
        // grey
        backgroundColor: 'rgb(50,50,50)'
    };

    // log out
    const handleLogout = async () => {
        await auth.signOut();
        navigate('/');
    }

    // page authentication
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        auth.onAuthStateChanged((currentUser) => setUser(currentUser));
     }, []);

    return (
        <AppBar position='sticky' style={style} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Typography>
                    Team Urban Science
                </Typography>
                <Typography sx={{ flexGrow: 1 }}>
                </Typography>
                <NavButton><NavLink to="/">Home</NavLink></NavButton>
                {user ? (
                <React.Fragment>
                    <NavButton><NavLink to="/audit">Audit</NavLink></NavButton>
                    <CustomButton onClick={handleLogout}>Logout</CustomButton>
                    </React.Fragment>
                    ) : (<CustomButton><NavLink to="login">Login</NavLink></CustomButton>)}
            </Toolbar>
        </AppBar>
    );
};

export const SideBar = () => {
    const location = useLocation();
    const path = location.pathname;
    const colorSelected = {
        "&.Mui-selected": {
            backgroundColor: "#bae38c",
            "&:hover": {
                backgroundColor: "#bae38c"
            }
        },
        "&:hover": {
            backgroundColor: "#ddf1c6"
        },
        marginLeft: -3,
    };

    return (
        <Drawer variant='permanent' anchor='left'>
            <Toolbar sx={{ marginTop: 7.5, width: 100 }}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ ...colorSelected }} selected={path === '/audit'} component={Link} to="/audit">
                            <ListItemText primary="Dashboard" sx={{ width: 120 }} />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ ...colorSelected }} selected={path === '/audit/upload'} component={Link} to="/audit/upload">
                            <ListItemText primary="Upload" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ ...colorSelected }} selected={path === '/audit/results'} component={Link} to="/audit/results">
                            <ListItemText primary="Results" />
                        </ListItemButton>
                    </ListItem>
                    <Divider sx={{ ...colorSelected }}></Divider>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ ...colorSelected }}>
                            <ListItemText primary="Contact" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ ...colorSelected }}>
                            <ListItemText primary="Settings" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Toolbar>
        </Drawer >
    );
};