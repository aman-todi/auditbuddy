import React from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import FileUpload from '../components/FileUpload';

function AuditPage () {

    return (
        <React.Fragment>
        <MaterialUI.SideBar></MaterialUI.SideBar>
        <header className="App-header" style={{marginLeft: 125}}>
        <div className="App">
          <h1>Upload Media</h1>
          <p>Submit the audit data and press 'Analyze' to send your files to processing.</p>
        </div>
        <div className="File">
        <FileUpload/>
        </div>
        </header>
        </React.Fragment>
    );
}

export default AuditPage;