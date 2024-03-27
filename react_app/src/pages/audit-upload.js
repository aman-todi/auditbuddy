import React, { useState, useEffect } from 'react';
import '../App.css';
import FormImport from '../components/FormImport';
import { auth } from '../components/Authentication';

function AuditPage() {
  
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
      <header className="App-header">
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