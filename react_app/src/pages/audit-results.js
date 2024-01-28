import React from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';

function AuditPage () {

    return (
        <React.Fragment>
        <MaterialUI.SideBar></MaterialUI.SideBar>
        <header className="App-header" style={{marginLeft: 100}}>
        <div className="App">
          <p>Results</p>
        </div>
        </header>
        </React.Fragment>
    );
}

export default AuditPage;