import React, {useState, useEffect} from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import {auth} from '../components/Authentication';
import {DealershipListImport} from '../components/DealershipList';
import { useTheme, useMediaQuery } from '@mui/material';
import { useAdmin } from '../components/Admin';
import MinRequirements from '../components/AddMinRequirements';
import { Container } from '@mui/material';

function DealershipsPage () {

  // page authentication
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => setUser(currentUser));
  }, []);

   // for mobile responsiveness
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

   // check if user is an admin
   const { admin } = useAdmin();
 
    return (
        <React.Fragment>
        {admin ? 
        (
          <React.Fragment>
          <MaterialUI.SideBar></MaterialUI.SideBar>
          <header className="App-header" style={{ marginLeft: isMobile ? 0 : 125 }}>
          <div className="App">
          <h1>Manage Dealerships</h1>
          </div>
          <div className="File">
            <Container style={{marginBottom: '5rem'}}>
              <MinRequirements></MinRequirements>
            </Container>
            <Container>
              <DealershipListImport/>
            </Container>
          </div>
            </header>
            </React.Fragment>
            
          ) : (<p>Not Authorized</p>)
        }
        </React.Fragment>
    );
}

export default DealershipsPage;