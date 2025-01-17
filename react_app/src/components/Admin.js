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
        const userToken = user.email
        const response = await axios.post('/check-admin', {userToken});
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
    
    });

    return (
        <AdminContext.Provider value={{ admin }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => useContext(AdminContext);