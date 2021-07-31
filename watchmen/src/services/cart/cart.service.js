import axios from "axios";
import cookie from "react-cookies";

const baseURL = process.env.REACT_APP_API_URL;

const client = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${cookie.load("authToken")}`
    },
})


const getCartItems = async () => {
    try {
        let cart = null;
        let response = await client.get('/orders/api/v1/cart/')
        if (response) cart = response.data;
        console.log(cart)
        return cart;
    } catch(error){
        return error.response
    }
}

const addToCart = async (item) => {
    try {
        let product = null;
        let response = await client.post('/orders/api/v1/cart/', {...item});
        if (response) product = response.data;
        console.log(product);
        return product;
    } catch(error){
        return error.response;
    }
}


const updateCartItem = async (pk ,product) => {
    try {
        let item = null;
        let response = await client.put(`/orders/api/v1/cart/${pk}/`, {item: product.product,quantity: product.quantity});
        if (response) item = response.data;
        console.log(item);
        return item;
    } catch(error){
        return error.response;
    }
}

const deleteCartItem = async pk => {
    try {
        let state = null;
        let response = await client.delete(`/orders/api/v1/cart/${pk}/`);
        if (response) state = response.data;
        console.log(state);
        return state;
    } catch(error){
        return error.response.data;
    }
}

export const cartAPI = {
    getCartItems,
    addToCart,
    updateCartItem,
    deleteCartItem
}
