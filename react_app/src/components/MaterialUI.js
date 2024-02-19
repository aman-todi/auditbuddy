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
import ListItemIcon from '@mui/material/ListItemIcon';

// icons
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BallotIcon from '@mui/icons-material/Ballot';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
// authentication
import { auth } from '../components/Authentication';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAdmin } from './Admin';

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
        <AppBar position='fixed' style={style} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
                <Typography sx={{fontSize: "0.85rem"}}>
                    AUDITBUDDY
                </Typography>
                <Typography sx={{flexGrow: 1}}></Typography>
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

    // page authentication
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
        auth.onAuthStateChanged((currentUser) => setUser(currentUser));
    }, []);

    const { admin } = useAdmin();

    return (
        <Drawer variant='permanent' anchor='left' sx={{width: 100}}>
            <Toolbar sx={{ marginTop: 7.5, width: 100 }}>
                <List>
                    <Typography sx={{ fontSize: '0.9rem', marginLeft: -1 }} disablePadding><strong>Welcome,</strong> {user.email}</Typography>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ ...colorSelected }} selected={path === '/audit'} component={Link} to="/audit">
                            <ListItemIcon sx={{minWidth: 40}}><AlignHorizontalLeftIcon></AlignHorizontalLeftIcon></ListItemIcon>
                            <ListItemText
                                primary={<Typography sx={{ fontSize: '0.9rem' }}>Dashboard</Typography>}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ ...colorSelected }} selected={path === '/audit/upload'} component={Link} to="/audit/upload">
                            <ListItemIcon sx={{minWidth: 40}}><CloudUploadIcon></CloudUploadIcon></ListItemIcon>
                            <ListItemText
                                primary={<Typography sx={{ fontSize: '0.9rem' }}>Upload</Typography>}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ ...colorSelected }} selected={path === '/audit/results'} component={Link} to="/audit/results">
                            <ListItemIcon sx={{minWidth: 40}}><BallotIcon></BallotIcon></ListItemIcon>
                            <ListItemText
                                primary={<Typography sx={{ fontSize: '0.9rem' }}>Results</Typography>}
                            />
                        </ListItemButton>
                    </ListItem>


                    {admin ? (
                        <React.Fragment>
                        <Divider sx={{ ...colorSelected }}></Divider>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ ...colorSelected }} selected={path === '/audit/admin-console'} component={Link} to="/audit/admin-console">
                                <ListItemIcon sx={{minWidth: 40}}><AdminPanelSettingsIcon /></ListItemIcon>
                                <ListItemText
                                    primary={<Typography sx={{ fontSize: '0.9rem' }}>Console</Typography>}
                                />
                            </ListItemButton>
                        </ListItem>
                        </React.Fragment>
                    ) : null}

                    <Divider sx={{ ...colorSelected }}></Divider>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ ...colorSelected }} selected={path === '/audit/dealerships'} component={Link} to="/audit/dealerships">
                            <ListItemIcon sx={{minWidth: 40}}><AddBusinessIcon></AddBusinessIcon></ListItemIcon>
                            <ListItemText
                                primary={<Typography sx={{ fontSize: '0.9rem' }}>Dealerships</Typography>}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ ...colorSelected }}>
                            <ListItemIcon sx={{minWidth: 40}}><HelpOutlineIcon></HelpOutlineIcon></ListItemIcon>
                            <ListItemText
                                primary={<Typography sx={{ fontSize: '0.9rem' }}>Contact</Typography>}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ ...colorSelected }}>
                            <ListItemIcon sx={{minWidth: 40}}><SettingsIcon></SettingsIcon></ListItemIcon>
                            <ListItemText
                                primary={<Typography sx={{ fontSize: '0.9rem' }}>Settings</Typography>}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Toolbar>
        </Drawer >
    );
};