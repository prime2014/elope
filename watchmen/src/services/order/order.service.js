import axios from "axios";
import cookie from "react-cookies";


let baseURL = process.env.REACT_APP_API_URL;

let client = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${cookie.load("authToken")}`
    }
})


const getOrderDetail = async pk => {

    try {
        let order = null;
        let response = await client.get(`/orders/api/v1/order/${pk}/`);
        if (response) order = response.data;
        console.log(order)
        return order;
    } catch(error){
        console.error(error.response.data);
    }
}

const addShippingAddress = async (pk, address) => {
    try{
        let postal_address = null;
        let response = await client.patch(`/orders/api/v1/order/${pk}/add_shipping_address/`, {...address});
        if (response) postal_address = response.data;
        console.log(address);
        return postal_address;
    } catch(error){
        console.error(error.response.data);
    }
}

const placeOrder = async (pk, data) => {
    axios.defaults.headers = {"Content-Type": "application/json", "Authorization": `Token ${cookie.load("authToken")}`}
    axios.defaults.baseURL = process.env.REACT_APP_API_URL;
    try {
        let state = null;
        let response = await axios.put(`/orders/api/v1/place-order/${pk}/`, {'status': 'PLACED', ...data});
        if (response) state = response.data;
        return state;
    } catch(error){
        return error.response.data;
    }
}

export const orderAPI = {
    getOrderDetail,
    addShippingAddress,
    placeOrder
}
