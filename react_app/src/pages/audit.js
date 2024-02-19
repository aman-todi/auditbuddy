import React, {useState, useEffect} from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import { auth } from '../components/Authentication';

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
          <MaterialUI.SideBar></MaterialUI.SideBar>
          <header className="App-header" style={{marginLeft: 125}}>
          <div className="App">
              <h1>Dashboard</h1>
              </div>
              </header>
            </React.Fragment>
          ) : (<p>Not Authorized</p>)
        }
        </React.Fragment>
    );
}

export default AuditPage;