import React, {useState, useEffect} from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import { auth } from '../components/Authentication';
import { useTheme, useMediaQuery } from '@mui/material';
import * as Dash from '../components/Dashboard';

function AuditPage () {

  // page authentication
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => setUser(currentUser));
  }, []);

    // for mobile responsiveness
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <React.Fragment>
        {user ? 
        (
          <React.Fragment>
          <MaterialUI.SideBar></MaterialUI.SideBar>
          <header className="Dash-header" style={{ marginLeft: isMobile ? 0 : 125 }}>
          <div className="App">
              <h1>Dashboard</h1>
              </div>
              </header>
            <Dash.NewChanges></Dash.NewChanges>
            <Dash.TopDealerships></Dash.TopDealerships>
            </React.Fragment>
          ) : (<p>Not Authorized</p>)
        }
        </React.Fragment>
    );
}

export default AuditPage;