import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import NewChangesBox from '../components/NewChangesBox';
import TopDealershipsBox from '../components/TopDealershipsBox';
import BrandDealershipViewer from '../components/BrandDealershipViewer';
import { auth } from '../components/Authentication';
import '../App.css';

function AuditPage() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => setUser(currentUser));
  }, []);

  return (
    <React.Fragment>
      <header className="App-header">
        <div className="App">
          <h1>Dashboard</h1>
        </div>
      </header>
      {user ? (
        <Grid container spacing={2} sx={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
          {/* Left section */}
          <Grid item style={{ width: '25%' }}>
            <Grid container direction="column" spacing={1}>
              <Grid item>
                <NewChangesBox />
              </Grid>
              <Grid item>
                <TopDealershipsBox />
              </Grid>
            </Grid>
          </Grid>
          {/* Right section */}
          <Grid item style={{ width: '75%' }}>
            <BrandDealershipViewer onClickResult={(result) => console.log(result)} />
          </Grid>
        </Grid>
      ) : (
        <Typography variant="body1">Not Authorized</Typography>
      )}
    </React.Fragment>
  );
}

export default AuditPage;
