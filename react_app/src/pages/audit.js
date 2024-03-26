import React, { useState, useEffect } from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import { auth } from '../components/Authentication';
import { useTheme, useMediaQuery, Grid, Paper, Box } from '@mui/material';
import * as Dash from '../components/Dashboard';

function AuditPage() {
    const [user, setUser] = useState(auth.currentUser);
    const [clickedResult, setClickedResult] = useState(null); 

    useEffect(() => {
        auth.onAuthStateChanged((currentUser) => setUser(currentUser));
    }, []);

    return (
      <React.Fragment>
        {user ? (
          <React.Fragment>
            <Grid container spacing={2} sx={{ marginTop: '55px' }}>
              <Grid item xs={12} md={4} lg={4} sx={{ marginTop: '17px' }}>
                <Grid container direction="column" spacing={2}>
                  <Grid item sx={{ marginLeft: '50px' }}>
                    <Dash.NewChanges />
                  </Grid>
                  <Grid item sx={{ marginLeft: '50px' }}>
                    <Dash.TopDealerships />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={4} lg={4} sx={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                <Dash.SearchBox onClickResult={setClickedResult} /> 
              </Grid>
              <Grid item xs={12} md={4} lg={4} sx={{ marginTop: '17px' }}>
                <Grid container direction="column" spacing={2}>
                  <Grid item sx={{ marginRight: '50px'}}>
                    <Dash.Box1Component clickedResult={clickedResult} /> 
                  </Grid>
                  <Grid item sx={{marginRight: '50px' }}>
                    <Dash.Box1Component clickedResult={clickedResult} /> 
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </React.Fragment>
        ) : (
          <p>Not Authorized</p>
        )}
      </React.Fragment>
    );
}

export default AuditPage;