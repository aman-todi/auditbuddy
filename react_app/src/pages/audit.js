import React from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import { auth } from '../components/Authentication';

function AuditPage () {
  const user = auth.currentUser;
    return (
        <React.Fragment>
        {user ? 
        (
          <React.Fragment>
          <MaterialUI.SideBar></MaterialUI.SideBar>
          <header className="App-header" style={{marginLeft: 125}}>
          <div className="App">
              <p>Welcome, {user.email}</p>
              <p>Dashboard</p>
              </div>
              </header>
            </React.Fragment>
          ) : (<p>Not Authorized</p>)
        }
        </React.Fragment>
    );
}

export default AuditPage;