import React, { useState } from 'react';
import * as MaterialUI from '../components/MaterialUI';
import { useTheme, useMediaQuery} from '@mui/material';


function ContactPage() {

  return (

    <React.Fragment>
    <header className="App-header">
    <MaterialUI.ContactForm ></MaterialUI.ContactForm>
    </header>
    </React.Fragment>

  );
}

export default ContactPage;