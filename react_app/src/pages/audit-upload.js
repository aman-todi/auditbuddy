import React, { useState, useEffect } from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import FormImport from '../components/FormImport';
import { auth } from '../components/Authentication';
import { useTheme, useMediaQuery} from '@mui/material';

function AuditPage() {
  
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
      <header className="App-header" style={{ marginLeft: isMobile ? 0 : 125 }}>
        <div className="App">
          <h1 sx={{}} >Upload Media</h1>
          <p>Complete the form below and press 'Analyze' to process the audit data</p>
        </div>
        <div className="File">
          <FormImport />
        </div>
      </header>
      </React.Fragment>
      ) : (<p>Not Authorized</p>)
      }
    </React.Fragment>
  );
}

export default AuditPage;