import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import HelpIcon from '@mui/icons-material/Help';
// for user table
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const UserListImport = () => {
  // store user dealerships
  const [users, setUsers] = useState([]);

  // check if table is loading
  const [loading, setLoading] = useState(true);

  // get the dealerships when user enter page
  useEffect(() => {

    // axios request to get dealerships
    const fetchData = async () => {
      try {
        const response = await axios.post('http://localhost:8080/all-users');
        // set dealerships
        setUsers(response.data);
        setLoading(false);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // fetch users
    fetchData();
  }, []);

  return (
    <Container component="main" maxWidth="s">
      <Typography variant="p" sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}>
        <span style={{ fontWeight: "bold", marginRight: "0.5rem" }}>User List</span>
        <Tooltip disableFocusListener title="List of all users">
          <HelpIcon sx={{ fontSize: "small" }} />
        </Tooltip>
      </Typography>
      <div style={{ overflowY: "scroll", maxHeight: "15rem" }}>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {loading ? (
            <TableRow>
            <TableCell colSpan={3}>Loading...</TableCell>
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
      </div>
    </Container>
  );
};

export default UserListImport;
