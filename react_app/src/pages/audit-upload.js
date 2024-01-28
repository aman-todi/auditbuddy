import React from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import FileUpload from '../components/FilePond';

function AuditPage () {

    return (
        <React.Fragment>
        <MaterialUI.SideBar></MaterialUI.SideBar>
        <header className="App-header" style={{marginLeft: 125}}>
        <div className="App">
          <p>Upload Media</p>
        </div>
        <div className="File">
        <FileUpload/>
        </div>
        </header>
        </React.Fragment>
    );
}

export default AuditPage;