import React, { useState } from 'react';
import * as MaterialUI from '../components/MaterialUI';


function ContactPage() {
  return (

    <React.Fragment>
    <header className="App-header" style={{marginLeft: 125}}>
    <div><MaterialUI.SideBar></MaterialUI.SideBar></div> 
    <MaterialUI.ContactForm></MaterialUI.ContactForm>
    </header>
    </React.Fragment>

  );
}

export default ContactPage;