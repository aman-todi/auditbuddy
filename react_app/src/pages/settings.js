import React, {useState, useEffect} from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import { auth } from '../components/Authentication';

function SettingsPage() {
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
      auth.onAuthStateChanged((currentUser) => setUser(currentUser));
    }, []);
  
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => {
        setIsDarkMode(prevMode => !prevMode);
    };

    return (
        <React.Fragment>
                    {user ? 
        (
            <React.Fragment>
            <div><MaterialUI.SideBar  isDarkMode={isDarkMode}></MaterialUI.SideBar></div>
            <header className="App-header" style={{marginLeft: 125}}>
            <div className="settings-container">
                <h1 className="title" >Settings</h1>
                <hr className="divider" />
                <div className="section">
                    <h2 className="subtitle">Display</h2>
                    <hr className="second-divider" />
                    <button onClick={toggleDarkMode} className="dark-toggle">
                        {isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                    </button>
                    <h2 className="subtitle">Account Preferences</h2>
                    <hr className="second-divider" />
                    <p></p>

                </div>
            </div>
            </header>
            </React.Fragment>
          ) : (<p>Not Authorized</p>)
        }

        </React.Fragment>
    );
}

export default SettingsPage;