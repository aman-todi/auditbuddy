import React, { useState } from 'react';
import * as MaterialUI from '../components/MaterialUI';
import { useTheme, useMediaQuery} from '@mui/material';


function ContactPage() {

    // for mobile responsiveness
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (

    <React.Fragment>
    <header className="App-header" style={{ marginLeft: isMobile ? 0 : 125 }}>
    <div><MaterialUI.SideBar></MaterialUI.SideBar></div> 
    <MaterialUI.ContactForm></MaterialUI.ContactForm>
    </header>
    </React.Fragment>

  );
}

export default ContactPage;