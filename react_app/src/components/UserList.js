import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
// for user table
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress } from '@mui/material';

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
export const UserListImport = ({ refresh }) => {
  // store user dealerships
  const [users, setUsers] = useState([]);

  // check if table is loading
  const [loading, setLoading] = useState(true);

  // get the dealerships when user enter page
  useEffect(() => {

    // fetch users
    fetchData(setUsers, setLoading);
  }, [refresh]);


  return (
    <Container component="main" maxWidth="s">
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>User List</span>
        <Tooltip disableFocusListener title="List of all users">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: "15rem" }}>
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
                users.map((user, index) => (
                <TableRow key={index}>
                    <TableCell>{user['email']}</TableCell>
                    <TableCell>{user['role']}</TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
