import React, {useState, useEffect} from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import { auth } from '../components/Authentication';
import {useTheme, useMediaQuery} from '@mui/material';


function SettingsPage({ darkMode, toggleDarkMode }) {
   const [user, setUser] = useState(auth.currentUser);


   useEffect(() => {
     auth.onAuthStateChanged((currentUser) => setUser(currentUser));
   }, []);

    // for mobile responsiveness
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

   return (
       <React.Fragment>
                   {user ?
       (
           <React.Fragment>
           <div><MaterialUI.SideBar></MaterialUI.SideBar></div>
           <header className="App-header" style={{ marginLeft: isMobile ? 0 : 125 }}>
           <MaterialUI.Settings darkMode={darkMode} toggleDarkMode={toggleDarkMode} ></MaterialUI.Settings>
           </header>
           </React.Fragment>
         ) : (<p>Not Authorized</p>)
       }


       </React.Fragment>
   );
}


export default SettingsPage;