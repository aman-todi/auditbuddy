import React, {useState, useEffect} from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import {auth} from '../components/Authentication';
import AddDealershipImport from '../components/AddDealership';
import {DealershipListImport} from '../components/DealershipList';
import { useTheme, useMediaQuery } from '@mui/material';

function DealershipsPage () {

  // page authentication
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => setUser(currentUser));
  }, []);

   // handle user table refresh
   const [refresh, setRefresh] = useState(false);

   const handleRefresh = () => {
     setRefresh(!refresh);
   };

   // for mobile responsiveness
   const theme = useTheme();
   const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    return (
        <React.Fragment>
        {user ? 
        (
          <React.Fragment>
          <MaterialUI.SideBar></MaterialUI.SideBar>
          <header className="App-header" style={{ marginLeft: isMobile ? 0 : 125 }}>
          <div className="App">
          <h1>Manage Dealerships</h1>
          </div>
          <div className="File">
            
              <AddDealershipImport refresh={handleRefresh}/>
              <DealershipListImport refresh={refresh}/>

          </div>
            </header>
            </React.Fragment>
            
          ) : (<p>Not Authorized</p>)
        }
        </React.Fragment>
    );
}

export default DealershipsPage;