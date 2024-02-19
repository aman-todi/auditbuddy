// react
import {useState, useEffect, useContext, createContext} from 'react';

// axios
import axios from 'axios';
// authentication
import { auth } from './Authentication';


// check if the logged in user is an admin
export const checkAdmin = async (user) => {
    try 
    {
        console.log("user in function: ", user)
        const userToken = await user.getIdToken();
        console.log("check token: ", userToken)
        const response = await axios.post('http://localhost:8080/check-admin', {userToken});
        const isAdmin = response.data.isAdmin;
        return isAdmin;
    }
    catch(error)
    {
        if (error.response)
        {
            console.log(error.response.data);
        }
    }
}


// passing admin data through top level, instead of when going on page
const AdminContext = createContext();

// adding admin check when web app loads
export const AdminCheck = ({ children }) => {
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) 
            {
                try {
                    const isAdmin = await checkAdmin(user);
                    setAdmin(isAdmin); // set accordingly to the check
                } catch (error) {
                    console.error('Error checking admin status:', error);
                }
            } 
            else 
            {
                setAdmin(false); // no admin
            }
        });
    
    }, [auth.currentUser]); // dependency if the user is changed (rechecks admin)

    return (
        <AdminContext.Provider value={{ admin }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);