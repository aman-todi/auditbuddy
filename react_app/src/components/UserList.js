import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
import * as MaterialUI from './MaterialUI';
// for user table
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';
// for pop up
import { Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, Button, TextField, Box, FormControl, InputLabel} from '@mui/material';
//axios request to get users
export const fetchData = async (setUsers, setLoading) => {
  setLoading(true);
  try {
    const response = await axios.post('http://localhost:8080/all-users');
    setUsers(response.data);
    setLoading(false);
    console.log(response.data);
  } catch (error) {
    console.error('Error fetching users:', error);
    setLoading(false);
  }
};

// added props
export const UserListImport = () => {
  // store user dealerships
  const [users, setUsers] = useState([]);

  // check if table is loading
  const [loading, setLoading] = useState(true);

  // handle user table refresh
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

   // keep track of states for create user
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [confirm, setConfirm] = useState('');
   const [error, setError] = useState(null);

  // get the dealerships when user enter page
  useEffect(() => {

    // fetch users
    fetchData(setUsers, setLoading);
  }, [refresh]);

  // function to update values of user role
  const updateValues = async (role, clickedUser) => {
    try {
      // append to a form the user email and new role
      // create a form and append this file
      const formData = new FormData();

      // extract information from dealership
      formData.append('email', clickedUser['email']);
      formData.append('old_role', clickedUser['role']);
      formData.append('new_role', role);

    const response = await axios.post('http://localhost:8080/user-update-values', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
      // once the backend is changed, then we need to update the table immediately
      await fetchData(setUsers, setLoading);

      console.log(response.data)
    } catch (error) {
      console.error('Error users: ', error);
    }
  };

  // handle a deletion
  const handleDelete = () => {

    // call to the backend with dealership information
    deleteUser(clickedUser);
  }

  // function to delete a dealership from the list
  const deleteUser = async (clickedUser) => {
  try {
    // append to a form the dealership uid
    const formData = new FormData();

    // extract information from dealership
    formData.append('email', clickedUser['email']);
    formData.append('role', clickedUser['role'])

    const response = await axios.post('http://localhost:8080/delete-user', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
      // once the backend is changed, then we need to update the table immediately
      await fetchData(setUsers, setLoading);

      // close the pop up
      handlePopup();

      console.log(response.data)
    } catch (error) {
      console.error('Error deleting dealership', error);
    }
  };

  // get role for clicked user
  const [role, setRole] = useState(null);
  const [originalRole, setOriginalRole] = useState(role);

  // control the clicked user
  const [clickedUser, setClickedUser] = useState([]);
  const handleClickedUser = (user) => {
    setClickedUser(user);
    setRole((user['role']))
    setPopup(true);
  };

  // control the pop up
  const [popup, setPopup] = useState(false);
  const handlePopup = () => {
    setPopup(false);
  };

  // see if we are in edit mode
  const [editMode, setEditMode] = useState(false);

  // cancel the edit
  const handleCancelEdit = () => {
    setRole(originalRole);
    setEditMode(false);
  };

  // exit from edit mode for role change
  const handleUpdate = () => {
    setEditMode(false);

    // call to the backend with the user information
    updateValues(role, clickedUser);
  };

  // state to handle search
  const [searchQuery, setSearchQuery] = useState('');

  // handle search
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // filter the dealership off of typed search
  const filteredUsers = users.filter((user) => {

    // all dealership fields
    const searchFields = [
      'email',
      'role',
    ];
    // if some of the fields are included, we include those results
    return searchFields.some((field) =>
      String(user[field]).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // control the pop up for add users
  const [popupUser, setPopupUser] = useState(false);
  const handlePopupUser = () => {
    setPopupUser(!popupUser);
  };

  // handles each form input states
  const handleFormInput = (event, setFormInputState) => {
    setFormInputState(event.target.value);
  };

  // create user function
  const createUser = async () => {

    if (password != confirm)
    {
      setError("Passwords do not match");
    }
    else if (role == "")
    {
      setError("User role not selected")
    }
    else {
        // create a form and append this file
        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        formData.append('role', role)

        try {
          const response = await axios.post('http://localhost:8080/create-user', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });

          // change state to refresh table
          handleRefresh();
          setError(`User created successfully: ${response.data.email}`);

        }
        catch (error) {
          if (error.response) 
          {
            setError(`Error creating user: ${error.response.data.error}`);
          } 
          else if (error.request) 
          {
            setError('Error creating user: No response from server');
          } 
          else 
          {
            setError('Error creating user');
          }
        }
    }
};
     
  return (
    <Container component="main" maxWidth="s" fullWidth>
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>User List</span>
        <Tooltip disableFocusListener title="List of all users">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
        <span style={{marginLeft: 'auto'}}>
          <MaterialUI.CustomButton onClick={handlePopupUser}>Add User</MaterialUI.CustomButton>
        </span>
      </Typography>

       {/* dialog for add user */}
       <Dialog open={popupUser} onClose={handlePopupUser} fullWidth maxWidth="lg">
          <DialogTitle>Add User</DialogTitle>
          <DialogContent>
          <Container component= "main" maxWidth="s">
              <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
                <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>Add User</span>
              <Tooltip disableFocusListener title="The information of the user you want to create">
                <HelpIcon sx={{ fontSize: "small" }} />
              </Tooltip>
              </Typography>

              <Box sx={{ display: "flex", flexDirection: { xs: 'column', sm: 'row' }, alignItems: "center" }}>
              <TextField  sx={{ margin: "0.1rem"}} fullWidth value = {email} onChange={(e) => setEmail(e.target.value)} required id="email" label='Email' variant="outlined" margin="normal"/>
              <TextField  sx={{ margin: "0.1rem"}} fullWidth value = {password} onChange={(e) => setPassword(e.target.value)} required id="password" label='Password' variant="outlined" margin="normal" type="password"/>
              <TextField  sx={{ margin: "0.1rem"}} fullWidth value = {confirm} onChange={(e) => setConfirm(e.target.value)} required id="confirm" label='Confirm Password' variant="outlined" margin="normal" type="password"/>
              <FormControl required fullWidth sx={{ margin: "0.1rem"}}>
                <InputLabel>User Role</InputLabel>
                  <Select
                    value={role}
                    label="User Role"
                    onChange={(event) => handleFormInput(event, setRole)}
                  >
                    <MenuItem value={"Admin"}>Admin</MenuItem>
                    <MenuItem value={"Auditor"}>Auditor</MenuItem>
                  </Select>
              </FormControl>
              </Box>
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0.1rem" }}>
              <MaterialUI.CustomButton type ="submit" onClick={createUser}>Add User</MaterialUI.CustomButton>
              {error && <p id="error">{error}</p>}
              </Box>
        </Container>

          </DialogContent>
          <DialogActions>
            <MaterialUI.CustomButton onClick={handlePopupUser} color="primary">
              Close
            </MaterialUI.CustomButton>
          </DialogActions>
        </Dialog>

       {/* search bar */}
       <TextField
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
      />
      <TableContainer component={Paper} sx={{ maxHeight: "45vh" }} fullWidth>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {loading ? (
            <TableRow>
            <TableCell colSpan={3} align="center"><CircularProgress color="success" /></TableCell>
            </TableRow>
            ) : (
                filteredUsers.map((user, index) => (
                <TableRow key={index} sx={{cursor: 'pointer'}} onClick={() => handleClickedUser(user)}>
                    <TableCell>{user['email']}</TableCell>
                    <TableCell>{user['role']}</TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      
       {/* pop up */}
       <Dialog open={popup} onClose={handlePopup} fullWidth>
       <DialogTitle>{clickedUser && `${clickedUser['email']}`}</DialogTitle>
        <DialogContent sx={{marginBotton: '5rem'}}>

        <Select
          label="Role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          disabled={!editMode}
        >
        <MenuItem value="Auditor">Auditor</MenuItem>
        <MenuItem value="Admin">Admin</MenuItem>
        </Select>

        {/* the buttons to control edit/cancel/update */}
        <div>
           {!editMode && (
           <div>
           <MaterialUI.CustomButton onClick={() => {setEditMode(true); setOriginalRole(role);}}>
              Edit
           </MaterialUI.CustomButton>
           </div>
           )}
          {editMode && (
          <div>
            <MaterialUI.CustomButton onClick={handleUpdate}>Update</MaterialUI.CustomButton>
            <MaterialUI.CustomButton onClick={handleCancelEdit}>Cancel</MaterialUI.CustomButton>
          </div>
          )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button color="error" onClick={handleDelete}>Delete User</Button>
          <MaterialUI.CustomButton onClick={handlePopup}>Close</MaterialUI.CustomButton>
        </DialogActions>
      </Dialog>
    </Container>
    
  );
};
