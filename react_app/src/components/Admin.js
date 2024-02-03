// axios
import axios from 'axios';

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