import axios from "../axios.config";
import cookie from "react-cookies";


const loginUser = async (credentials) => {
    try{
        let user = null;
        let response = await axios.post('/accounts/api/login/', {...credentials});
        if (response) user =response.data;
        console.log(user);
        return user;
    } catch(error){
        console.log(error.response.data);
        return error.response.data;
    }
}



const logoutUser = async () => {
    axios.defaults.headers['Authorization'] = `Token ${cookie.load("authToken")}`;
    try {
        let state = null;
        let response = await axios.get('/accounts/api/logout/');
        if (response) state = response.data;
        console.log(state);
        return state;
    } catch(error){
        return error.response.data;
    }
}


const registerUser = async credentials => {
    try {
        let user = null;
        let response = await axios.post('/accounts/api/v1/users/', {...credentials});
        if (response) user = response.data;
        console.log(user);
        return user;
    } catch(error){
        return error.response.data;
    }
}

const resendActivationLink = async pk => {
    try {
        let status = null;
        let response = await axios.get(`/accounts/api/v1/users/${pk}/resend_activation_link/`)
        if (response) status = response.data;
        console.log(status);
        return status;
    } catch(error){
        return error.response.data;
    }
}


const getUser = async pk => {
    try {
        let user = null;
        let response = await axios.get(`/accounts/api/v1/users/${pk}/`);
        if (response) user = response.data;
        console.log(user);
        return user;
    } catch(error){
        return error.response;
    }
}

const activateUserAccount = async (pk, token) => {
    try {
        let user = null;
        let response = await axios.patch(`/accounts/api/v1/users/${pk}/`, { token });
        if (response) user = response.data;
        console.log(user);
        return user;
    } catch(error){
        return error.response.data;
    }
}

export const accountsAPI = {
    loginUser,
    registerUser,
    getUser,
    activateUserAccount,
    logoutUser,
    resendActivationLink
}
