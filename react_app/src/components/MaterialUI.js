import React, { useState, useEffect, useRef } from 'react';
// navbar/sidebar
import { Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme } from '@mui/material';
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
import { Card, CardContent, Grid, TextField } from '@mui/material';
import { Box, Switch } from '@mui/material';
// icons
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BallotIcon from '@mui/icons-material/Ballot';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
// authentication
import { auth } from '../components/Authentication';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAdmin } from './Admin';
import emailjs from '@emailjs/browser'

import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Avatar from '@mui/material/Avatar';

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

    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // log out
    const handleLogout = async () => {
        setAnchorEl(null);
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
                <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>
                    AUDITBUDDY
                </Typography>

                {!user && <NavButton><NavLink to="/">Home</NavLink></NavButton>}
                {user ? (
                    <React.Fragment>
                        <NavButton><NavLink to="/audit/dashboard">Audit</NavLink></NavButton>

                        {/* Profile Icon and Menu */}
                        <IconButton
                            size="large"
                            edge="end"
                            color="inherit"
                            aria-label="profile"
                            aria-controls="profile-menu"
                            aria-haspopup="true"
                            onClick={handleMenuOpen}
                        >
                            <Avatar /> {/* You can add the source for the Avatar if needed */}
                        </IconButton>

                        <Menu
                            id="profile-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleMenuClose}>
                                <NavLink to="/audit/profile" style={{ color: 'inherit', textDecoration: 'none' }}>Profile</NavLink>
                            </MenuItem>
                            <MenuItem onClick={handleMenuClose}>
                                <NavLink to="/audit/settings" style={{ color: 'inherit', textDecoration: 'none' }}>Settings</NavLink>
                            </MenuItem>
                            <MenuItem onClick={handleMenuClose}>
                                <NavLink to="/audit/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</NavLink>
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Logout</MenuItem>
                        </Menu>

                    </React.Fragment>
                ) : (<CustomButton><NavLink to="login">Login</NavLink></CustomButton>)}
            </Toolbar>
        </AppBar>
    );
};

export const SideBar = (props) => {

    // for mobile responsiveness
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

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
        <React.Fragment>
            {isMobile && (
                // fixed button at the button to toggle
                <CustomButton
                    sx={{
                        position: 'fixed',
                        bottom: theme.spacing(2),
                        right: theme.spacing(2),
                        zIndex: (theme) => theme.zIndex.drawer + 1,
                    }}
                    onClick={toggleSidebar}
                >
                    Menu
                </CustomButton>
            )}
            <Drawer variant={isMobile ? 'temporary' : 'permanent'} anchor='left' sx={{ width: 100 }}
                open={isMobile ? sidebarOpen : null}
                onClose={toggleSidebar}
            >
                <Toolbar sx={{ marginTop: 7.5, width: 145 }}>
                    <List>
                        <Typography sx={{ fontSize: '0.9rem', marginLeft: -1 }} disablePadding><strong>Welcome,</strong> {user && user.email}</Typography>
                            <ListItem disablePadding>
                                <ListItemButton sx={{ ...colorSelected }} selected={path === '/audit/dashboard'} component={Link} to="/audit/dashboard">
                                    <ListItemIcon sx={{ minWidth: 40 }}><AlignHorizontalLeftIcon></AlignHorizontalLeftIcon></ListItemIcon>
                                    <ListItemText
                                        primary={<Typography sx={{ fontSize: '0.9rem' }}>Dashboard</Typography>}
                                    />
                                </ListItemButton>
                            </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ ...colorSelected }} selected={path === '/audit/upload'} component={Link} to="/audit/upload">
                                <ListItemIcon sx={{ minWidth: 40 }}><CloudUploadIcon></CloudUploadIcon></ListItemIcon>
                                <ListItemText
                                    primary={<Typography sx={{ fontSize: '0.9rem' }}>Upload</Typography>}
                                />
                            </ListItemButton>
                        </ListItem>
                        <ListItem disablePadding>
                            <ListItemButton sx={{ ...colorSelected }} selected={path === '/audit/results'} component={Link} to="/audit/results">
                                <ListItemIcon sx={{ minWidth: 40 }}><BallotIcon></BallotIcon></ListItemIcon>
                                <ListItemText
                                    primary={<Typography sx={{ fontSize: '0.9rem' }}>Results</Typography>}
                                />
                            </ListItemButton>
                        </ListItem>


                        {admin ? (
                            <React.Fragment>
                                <Divider sx={{ ...colorSelected }}></Divider>
                                <Typography sx={{ fontSize: '0.9rem', marginLeft: -1 }}><b>Admin Console</b></Typography>
                                <ListItem disablePadding>
                                    <ListItemButton sx={{ ...colorSelected }} selected={path === '/audit/users'} component={Link} to="/audit/users">
                                        <ListItemIcon sx={{ minWidth: 40 }}><AdminPanelSettingsIcon /></ListItemIcon>
                                        <ListItemText
                                            primary={<Typography sx={{ fontSize: '0.9rem' }}>Users</Typography>}
                                        />
                                    </ListItemButton>
                                </ListItem>
                                <ListItem disablePadding>
                            <ListItemButton sx={{ ...colorSelected }} selected={path === '/audit/dealerships'} component={Link} to="/audit/dealerships">
                                <ListItemIcon sx={{ minWidth: 40 }}><AddBusinessIcon></AddBusinessIcon></ListItemIcon>
                                <ListItemText
                                    primary={<Typography sx={{ fontSize: '0.9rem' }}>Dealerships</Typography>}
                                />
                            </ListItemButton>
                            </ListItem>
                            </React.Fragment>
                        ) : null}

                        <Divider sx={{ ...colorSelected }}></Divider>
                       

                    </List>
                </Toolbar>
            </Drawer >
        </React.Fragment>
    );
};

export const ContactForm = () => {
    const formRef = useRef();


    const [success, setSuccess] = useState('');

    const sendEmail = (e) => {
        e.preventDefault();


        emailjs
            .sendForm('service_y59uwxw', 'template_3bqp34o', formRef.current, {
                publicKey: 'lGFFLVyIiAj0uD6mY',
            })
            .then(
                () => {
                    setSuccess("We have received your message")
                    console.log('SUCCESS!');
                },
                (error) => {
                    console.log('FAILED...', error.text);
                },
            );
    };

    return (

        <Grid container justifyContent="center">
            <Grid item xs={12} sm={8} md={6}>
                <Card sx={{ maxWidth: 450, padding: "20px 5px", margin: "0 auto" }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5">
                            Contact Us
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p" gutterBottom>
                            Questions or concerns? Fill out the form to get in touch with us.
                        </Typography>
                        <form ref={formRef} onSubmit={sendEmail}>
                            <TextField name="user_name" label="Name" variant="outlined" fullWidth required sx={{ marginBottom: 2 }} />
                            <TextField name="user_email" type="email" label="Email" variant="outlined" fullWidth required sx={{ marginBottom: 2 }} />
                            <TextField name="message" label="Message" multiline rows={4} variant="outlined" fullWidth required sx={{ marginBottom: 2 }} />
                            <CustomButton type="submit" variant="contained" fullWidth color="primary">
                                Send
                            </CustomButton>
                        </form>
                        <Box sx={{ marginTop: 1 }}><span style={{ color: 'green' }}>{success}</span></Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

    );

};


export const Settings = ({ darkMode, toggleDarkMode }) => {
    const handleDarkModeToggle = () => {
        toggleDarkMode();
    };
    const [open, setOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setSuccess(null);
        setOpen(false);
    };
    const handleSubmit = () => {
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            console.log("ERROR")
            return;
        }


        const auth = getAuth();
        const user = auth.currentUser;


        const credential = EmailAuthProvider.credential(user.email, oldPassword);




        reauthenticateWithCredential(user, credential)
            .then(() => {
                if (newPassword.length < 6) {
                    setError('Password should be at least 6 characters long.');
                    setSuccess(null)
                } else {
                    updatePassword(user, newPassword)
                        .then(() => {
                            setSuccess("Password changed successfully");
                            setError(null);

                        })
                        .catch((error) => {
                            console.error("Error updating password, please log out and log in again to reset.", error);
                            setSuccess(null)

                        });
                }
            })

            .catch((error) => {
                console.error("Old password is not correct:", error);
                setError('Old password is not correct.');
                setSuccess(null)


            });






    };
    return (
        <Box
            sx={{
                width: 360,
                padding: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 'borderRadius',
                marginBottom: '200px'
            }}
        >
            <Typography variant="h5">Settings</Typography>
            <Divider />
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle1">Display</Typography>
                <Divider />
                <Box sx={{ mt: 2 }}>
                    <Typography variant="body1">Dark Mode</Typography>
                    <Switch
                        checked={darkMode}
                        onChange={handleDarkModeToggle}
                        sx={{
                            '& .MuiSwitch-thumb': {
                                color: '#74b42d',
                            },
                            "& .Mui-checked": {
                                color: "#454545"


                            },
                            "& .MuiSwitch-track": {
                                backgroundColor: "#000 !important"
                            }
                        }}
                        color="primary"
                    />
                </Box>


                <Typography variant="subtitle1">Account</Typography>
                <Divider />
                <Box sx={{ mb: 4, mt: 2 }}>
                    <Button variant="contained" style={{ backgroundColor: '#74b42d' }} onClick={handleOpen}>
                        Change Password
                    </Button>
                    <Dialog open={open} onClose={handleClose} sx={{ marginLeft: '135px' }}>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogContent>
                            <form onSubmit={handleSubmit}>
                                <TextField
                                    type="password"
                                    margin="dense"
                                    fullWidth
                                    label="Old Password"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    required
                                />
                                <TextField
                                    type="password"
                                    margin="dense"
                                    fullWidth
                                    label="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <TextField
                                    type="password"
                                    margin="dense"
                                    fullWidth
                                    label="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </form>
                            <span style={{ color: 'red' }}>{error}</span>
                            <span style={{ color: 'green' }}>{success}</span>


                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleClose} color="primary">
                                Close
                            </Button>
                            <Button onClick={handleSubmit} color="primary">
                                Reset
                            </Button>
                        </DialogActions>
                    </Dialog>
                </Box>


            </Box>
        </Box>
    );
};




