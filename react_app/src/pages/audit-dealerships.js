import React, {useState, useEffect} from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import {auth} from '../components/Authentication';

function DealershipsPage () {

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
              <p>My Dealership</p>
              </div>
              </header>
            </React.Fragment>
          ) : (<p>Not Authorized</p>)
        }
        </React.Fragment>
    );
}

export default DealershipsPage;