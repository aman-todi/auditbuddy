import React, {useState, useEffect} from 'react';
import '../App.css';
import * as MaterialUI from '../components/MaterialUI';
import { auth } from '../components/Authentication';

function SettingsPage() {
    const [user, setUser] = useState(auth.currentUser);

    useEffect(() => {
      auth.onAuthStateChanged((currentUser) => setUser(currentUser));
    }, []);

    return (
        <React.Fragment>
                    {user ? 
        (
            <React.Fragment>
            <div><MaterialUI.SideBar></MaterialUI.SideBar></div>
            <header className="App-header" style={{marginLeft: 125}}>
            <MaterialUI.SettingsPage></MaterialUI.SettingsPage>
            </header>
            </React.Fragment>
          ) : (<p>Not Authorized</p>)
        }

        </React.Fragment>
    );
}

export default SettingsPage;