import React from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import FormImport from '../components/FormImport';
import { auth } from '../components/Authentication';

function AuditPage() {
  const user = auth.currentUser;
  return (
    <React.Fragment>
      {user ? 
      (
      <React.Fragment>
      <MaterialUI.SideBar></MaterialUI.SideBar>
      <header className="App-header" style={{ marginLeft: 125 }}>
        <div className="App">
          <h1>Upload Media</h1>
          <p>Submit the audit data and press 'Analyze' to send your files to processing.</p>
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