import React, { useState, useEffect } from 'react';
import { Typography, Grid, Container } from '@mui/material';
import NewChangesBox from '../components/NewChangesBox';
import TopDealershipsBox from '../components/TopDealershipsBox';
import BrandDealershipViewer from '../components/BrandDealershipViewer';
import { auth } from '../components/Authentication';
import '../App.css';
import { useAdmin } from '../components/Admin';

function AuditPage() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => setUser(currentUser));
  }, []);

  const { admin } = useAdmin();

  return (
    <React.Fragment>
      {admin ? (
        <React.Fragment>
          <header className="App-header">
            <div className="App">
              <h1>Dashboard</h1>
            </div>
          </header>

          {/* Replace Paper with a div */}
          <div style={{ display: 'flex'}}>
            <Container sx={{ flex: '1', overflow: 'hidden'}}>
              <Grid container direction="column" justifyContent="space-between" alignItems="flex-start" spacing={4}>
                <Grid item>
                  <NewChangesBox />
                </Grid>
                <Grid item>
                  <TopDealershipsBox />
                </Grid>
              </Grid>
            </Container>

            <div>
            <Container sx={{ flex: '1', overflow: 'hidden'}}>
              <BrandDealershipViewer onClickResult={(result) => console.log(result)} />
            </Container>
            </div>
          </div>
        </React.Fragment>
      ) : (
        <p>Not Authorized</p>
      )}
    </React.Fragment>
  );
}

export default AuditPage;
