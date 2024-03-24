import React, {useState, useEffect} from 'react';
import '../App.css';
import { auth } from '../components/Authentication';
import { useAdmin } from '../components/Admin';
import {UserListImport} from '../components/UserList';
function AdminUserPage () {

  // page authentication
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    auth.onAuthStateChanged((currentUser) => setUser(currentUser));
  }, []);

    const { admin } = useAdmin();

    return (
        <React.Fragment>
        {admin ? 
        (
          <React.Fragment>
          <header className="App-header">
          <div className="App">
              <h1>Manage Users</h1>
        <UserListImport></UserListImport>
          </div>
          </header>
          </React.Fragment>
          ) : (<p>Not Authorized</p>)
        }
        </React.Fragment>
    );
}

export default AdminUserPage;