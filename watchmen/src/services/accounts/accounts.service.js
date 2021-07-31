import axios from "../axios.config";



const loginUser = async (credentials) => {
    try{
        let user = null;
        let response = await axios.post('/accounts/api/login/', {...credentials});
        if (response) user = response.data;
        console.log(user);
        return user;
    } catch(error){
        return error.response;
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
        return error.response;
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
    activateUserAccount
}
