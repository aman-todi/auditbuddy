import React from 'react';
import '../App.css';
import FileUpload from '../components/FilePond';

function AuditPage () {
    return (
        <React.Fragment>
        <header className="App-header">
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