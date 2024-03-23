import React, {useState, useEffect} from 'react';
import '../App.css';
import { auth } from '../components/Authentication';
import * as Dash from '../components/Dashboard';
import { Typography } from '@mui/material';

function AuditPage () {

  // page authentication
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => setUser(currentUser));
  }, []);

    return (
        <React.Fragment>
        {user ? 
        (
          <React.Fragment>
          <header className="App-header">
    <div className="App">
      <h1>Dashboard</h1>
      <Typography sx={{ fontSize: '0.9rem', marginLeft: -1 }} disablePadding><strong>Welcome,</strong> {user && user.email}</Typography>
      <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
        <Dash.NewChanges />
        <Dash.TopDealerships />
      </div>
    </div>
  </header>
            </React.Fragment>
          ) : (<p>Not Authorized</p>)
         
        }
        
        </React.Fragment>
    );
}

export default AuditPage;