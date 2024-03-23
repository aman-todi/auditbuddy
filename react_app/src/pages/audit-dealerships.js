import React, {useState, useEffect} from 'react';
import '../App.css';
import {auth} from '../components/Authentication';
import {DealershipListImport} from '../components/DealershipList';
import { useAdmin } from '../components/Admin';
import MinRequirements from '../components/AddMinRequirements';
import { Container } from '@mui/material';

function DealershipsPage () {

  // page authentication
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => setUser(currentUser));
  }, []);

   // check if user is an admin
   const { admin } = useAdmin();
 
    return (
        <React.Fragment>
        {admin ? 
        (
          <React.Fragment>
          <header className="App-header">
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