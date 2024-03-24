import React, { useState, useEffect, useRef } from 'react';
// navbar
import { Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme } from '@mui/material';
import Button from '@mui/material/Button';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import { Card, CardContent, Grid, TextField } from '@mui/material';
import { Box, Switch } from '@mui/material';
// icons
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BallotIcon from '@mui/icons-material/Ballot';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import LogoutIcon from '@mui/icons-material/Logout';
// authentication
import { auth } from '../components/Authentication';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useAdmin } from './Admin';
import emailjs from '@emailjs/browser'

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

    // for admin menu
    const [anchorAdmin, setAnchorAdmin] = useState(null);

    const handleAdminOpen = (event) => {
        setAnchorAdmin(event.currentTarget);
    };

    const handleAdminClose = () => {
        setAnchorAdmin(null);
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

    // for color change based on path
    const location = useLocation();
    const path = location.pathname;

    // admin render
    const { admin } = useAdmin();

    // for mobile responsive navbar
    const [anchorNav, setAnchorNav] = useState(null);

    const handleClickNav = (event) => {
      setAnchorNav(event.currentTarget);
    };
  
    const handleCloseNav = () => {
      setAnchorNav(null);
    };

    // for mobile responsiveness
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // for checking dark mode
    const isDarkTheme = theme.palette.mode === 'dark';

    return (
        <React.Fragment>
        <AppBar position='fixed' style={style}>
            <Toolbar>
            {isMobile && (
          <IconButton
            color="inherit"
            aria-label="menu"
            aria-controls="menu"
            aria-haspopup="true"
            onClick={handleClickNav}
          >
            <MenuIcon />
          </IconButton>
        )}

            <Menu
                id="menu"
                anchorEl={anchorNav}
                open={Boolean(anchorNav)}
                onClose={handleCloseNav}
            >

            {/* menu pop up for navigation */}
            <Menu
                id="nav-menu"
                anchorEl={anchorNav}
                open={Boolean(anchorNav)}
                onClose={handleCloseNav}
            >

                <MenuItem onClick={handleCloseNav}>
                    <NavLink 
                        to="/audit/dashboard" 
                        style={{textDecoration: 'none', color: (path === '/audit/dashboard' ? '#bae38c' : (isDarkTheme ? 'rgb(245,245,245)' : 'rgb(50, 50, 50)')),
                        display: 'flex', alignItems: 'center'
                        }}
                    >
                        <AlignHorizontalLeftIcon style={{ marginRight: '0.5rem' }} />
                        Dashboard
                    </NavLink>
                </MenuItem>
                
                <MenuItem onClick={handleCloseNav}>
                        <NavLink 
                            to="/audit/upload" 
                            style={{textDecoration: 'none', color: (path === '/audit/upload' ? '#bae38c' : (isDarkTheme ? 'rgb(245,245,245)' : 'rgb(50, 50, 50)')),
                            display: 'flex', alignItems: 'center'
                            }}
                        >
                            <CloudUploadIcon style={{ marginRight: '0.5rem' }} />
                            Upload
                        </NavLink>
                </MenuItem>

                <MenuItem onClick={handleCloseNav}>
                        <NavLink 
                            to="/audit/results" 
                            style={{textDecoration: 'none', color: (path === '/audit/results' ? '#bae38c' : (isDarkTheme ? 'rgb(245,245,245)' : 'rgb(50, 50, 50)')),
                            display: 'flex', alignItems: 'center'
                            }}
                        >
                            <BallotIcon style={{ marginRight: '0.5rem' }} />
                            Results
                        </NavLink>
                </MenuItem>
        
            </Menu>

            </Menu>
                <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>
                    AUDITBUDDY
                </Typography>

                {!user && <NavButton><NavLink to="/">Home</NavLink></NavButton>}
                {user ? (
                    <React.Fragment>

                        {!isMobile ? (
                            <React.Fragment>
                             {/* dashboard button */}
                             <NavButton>
                             <NavLink 
                                 to="/audit/dashboard" 
                                 style={{textDecoration: 'none', color: (path === '/audit/dashboard' ? '#bae38c' : 'rgb(245,245,245)'),
                                 display: 'flex', alignItems: 'center'
                                 }}
                             >
                                 <AlignHorizontalLeftIcon style={{ marginRight: '0.5rem' }} />
                                 Dashboard
                             </NavLink>
                         </NavButton>

                        {/* upload button */}
                        <NavButton>
                        <NavLink 
                            to="/audit/upload" 
                            style={{textDecoration: 'none', color: (path === '/audit/upload' ? '#bae38c' : 'rgb(245,245,245)'),
                            display: 'flex', alignItems: 'center'
                            }}
                        >
                            <CloudUploadIcon style={{ marginRight: '0.5rem' }} />
                            Upload
                        </NavLink>
                    </NavButton>
                    
                         {/* results button */}
                         <NavButton>
                            <NavLink 
                                to="/audit/results" 
                                style={{textDecoration: 'none', color: (path === '/audit/results' ? '#bae38c' : 'rgb(245,245,245)'),
                                display: 'flex', alignItems: 'center'
                                }}
                            >
                                <BallotIcon style={{ marginRight: '0.5rem' }} />
                                Results
                            </NavLink>
                        </NavButton>
                    </React.Fragment>
                        ) : null
                        }

                        {/* admin icon */}
                        {admin ? (
                        <NavButton><AdminPanelSettingsIcon 
                            onClick={handleAdminOpen}
                            style={{textDecoration: 'none', color: (path === '/audit/dealerships' || path === '/audit/users') ? '#bae38c' : 'rgb(245, 245, 245)'}}
                            size="large"
                            edge="end"
                        />
                        </NavButton>) : null}

                        {/* admin menu */}
                        <Menu
                            id="admin-menu"
                            anchorEl={anchorAdmin}
                            open={Boolean(anchorAdmin)}
                            onClose={handleAdminClose}
                        >
                            <MenuItem onClick={handleAdminClose}>
                                <NavLink 
                                    to="/audit/users" 
                                    style={{textDecoration: 'none', color: (path === '/audit/users' ? '#bae38c' : (isDarkTheme ? 'rgb(245,245,245)' : 'rgb(50, 50, 50)')),
                                    display: 'flex', alignItems: 'center'
                                    }}
                                >
                                    <PersonAddIcon style={{ marginRight: '0.5rem' }} />
                                    Users
                                </NavLink>
                            </MenuItem>

                            <MenuItem onClick={handleAdminClose}>
                                <NavLink 
                                    to="/audit/dealerships" 
                                    style={{textDecoration: 'none', color: (path === '/audit/dealerships' ? '#bae38c' : (isDarkTheme ? 'rgb(245,245,245)' : 'rgb(50, 50, 50)')),
                                    display: 'flex', alignItems: 'center'
                                    }}
                                >
                                    <AddBusinessIcon style={{ marginRight: '0.5rem' }} />
                                    Dealerships
                                </NavLink>
                            </MenuItem>
                        </Menu>

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
                                <NavLink 
                                    to="/audit/profile" 
                                    style={{textDecoration: 'none', color: (path === '/audit/profile' ? '#bae38c' : (isDarkTheme ? 'rgb(245,245,245)' : 'rgb(50, 50, 50)')),
                                    display: 'flex', alignItems: 'center'
                                    }}
                                >
                                    <AccountBoxIcon style={{ marginRight: '0.5rem' }} />
                                    Profile
                                </NavLink>
                            </MenuItem>

                            <MenuItem onClick={handleMenuClose}>
                                <NavLink 
                                    to="/audit/contact" 
                                    style={{textDecoration: 'none', color: (path === '/audit/contact' ? '#bae38c' : (isDarkTheme ? 'rgb(245,245,245)' : 'rgb(50, 50, 50)')),
                                    display: 'flex', alignItems: 'center'
                                    }}
                                >
                                    <QuestionAnswerIcon style={{ marginRight: '0.5rem' }} />
                                    Contact
                                </NavLink>
                            </MenuItem>

                            <MenuItem onClick={handleMenuClose}>
                                <NavLink 
                                    to="/audit/settings" 
                                    style={{textDecoration: 'none', color: (path === '/audit/settings' ? '#bae38c' : (isDarkTheme ? 'rgb(245,245,245)' : 'rgb(50, 50, 50)')),
                                    display: 'flex', alignItems: 'center'
                                    }}
                                >
                                    <SettingsIcon style={{ marginRight: '0.5rem' }} />
                                    Settings
                                </NavLink>
                            </MenuItem>

                            <MenuItem onClick={handleLogout}>
                                <NavLink 
                                    style={{textDecoration: 'none', color: ((isDarkTheme ? 'rgb(245,245,245)' : 'rgb(50, 50, 50)')),
                                    display: 'flex', alignItems: 'center'
                                    }}
                                >
                                    <LogoutIcon style={{ marginRight: '0.5rem' }} />
                                    Logout
                                </NavLink>
                            </MenuItem>
                        </Menu>

                    </React.Fragment>
                ) : (<CustomButton><NavLink to="login">Login</NavLink></CustomButton>)}
            </Toolbar>
            </AppBar>
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




