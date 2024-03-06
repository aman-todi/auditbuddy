import React, { useState, useEffect } from 'react';
// navbar/sidebar
import { Dialog, DialogTitle, DialogContent, DialogActions, useMediaQuery, useTheme} from '@mui/material';
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
import { makeStyles } from '@mui/material/styles';
import { Card, CardContent, Grid, TextField } from '@mui/material';
import { Box, Switch } from '@mui/material';
// icons
import AlignHorizontalLeftIcon from '@mui/icons-material/AlignHorizontalLeft';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BallotIcon from '@mui/icons-material/Ballot';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsIcon from '@mui/icons-material/Settings';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
// authentication
import { auth } from '../components/Authentication';
import { getAuth,updatePassword,reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
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
                {!user && <NavButton><NavLink to="/">Home</NavLink></NavButton>}
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
        <Drawer variant= { isMobile ? 'temporary' : 'permanent' } anchor='left' sx={{width: 100}}
            open={isMobile ? sidebarOpen : null}
            onClose={toggleSidebar}
        >
            <Toolbar sx={{ marginTop: 7.5, width: 145 }}>
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
                        <ListItemButton sx={{ ...colorSelected }} selected={path === '/audit/contact'} component={Link} to="/audit/contact">
                            <ListItemIcon sx={{minWidth: 40}}><HelpOutlineIcon></HelpOutlineIcon></ListItemIcon>
                            <ListItemText
                                primary={<Typography sx={{ fontSize: '0.9rem' }}>Contact</Typography>}
                            />
                        </ListItemButton>
                    </ListItem>
                    <ListItem disablePadding>
                        <ListItemButton sx={{ ...colorSelected }} selected={path === '/audit/settings'} component={Link} to="/audit/settings">
                            <ListItemIcon sx={{minWidth: 40}}><SettingsIcon></SettingsIcon></ListItemIcon>
                            <ListItemText
                                primary={<Typography sx={{ fontSize: '0.9rem' }}>Settings</Typography>}
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Toolbar>
        </Drawer >
        </React.Fragment>
    );
};

export const ContactForm = () => {

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
                <form>
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <TextField placeholder="Enter first name" label="First Name" variant="outlined" fullWidth required />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField placeholder="Enter last name" label="Last Name" variant="outlined" fullWidth required />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField type="email" placeholder="Enter email" label="Email" variant="outlined" fullWidth required />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField label="Message" multiline rows={4} placeholder="Type your message here" variant="outlined" fullWidth required />
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#74b42d', color: 'white', '&:hover': {
          backgroundColor: '#74b42d', 
        },}}>Submit</Button>
                    </Grid>
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

    );
    
};


export const Settings = ({darkMode, toggleDarkMode}) => {
    const handleDarkModeToggle = () => {
        toggleDarkMode();
    };
    const [open, setOpen] = useState(false);
    const [oldPassword, setOldPassword] = useState(''); 
    const [newPassword, setNewPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState(''); 
    const [error, setError] = useState(''); 
    const handleOpen = () => {
        setOpen(true);
      };
    
      const handleClose = () => {
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

                updatePassword(user, newPassword)
                    .then(() => {

                        handleClose();
                    })
                    .catch((error) => {
                        console.error("Error updating password:", error);

                    });
            })
            .catch((error) => {
                console.error("Old password is not correct:", error);
            });



        handleClose();
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
                <Button variant="contained" style={{ backgroundColor: '#74b42d'}} onClick={handleOpen}>
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
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
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
 


