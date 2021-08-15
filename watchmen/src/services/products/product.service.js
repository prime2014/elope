import { store } from "../../redux/configureStore";
import axios from "../axios.config";


const getCategory = async () => {
    try {
        let category = null;
        let response = await axios.get('/inventory/api/v1/category/');
        if (response) category = response.data
        return category;
    } catch(error){
        return error.response;
    }
}

const getProductList = async () => {
    try{
        let products = null;
        let response = await axios.get('/inventory/api/v1/products/');
        if (response) products = response.data.results;
        console.log(products);
        return products;
    } catch(error){
        return error.response;
    }
}

const getProductsAndOrder = async () => {
    let s = store.getState()
    let user_id = s.login.uid.id;
    let baseURL = process.env.REACT_APP_API_URL;
    let products = `${baseURL}/inventory/api/v1/products/`
    let order = `${baseURL}/orders/api/v1/order/?customer=${user_id}&status=DRAFT`;

    let get_products = axios.get(products);
    let get_order = axios.get(order);
    try {
        let response = await axios.all([get_products, get_order]);
        console.log(response);
        return response;
    } catch(errors) {
        return errors;
    }
}

const getProductDetail = async (pk) => {
    try {
        let product = null;
        let response = await axios.get(`/inventory/api/v1/products/${pk}/`)
        if (response) product = response.data;
        console.log(product);
        return product;
    } catch(error){
        return error.response;
    }
}


export const productAPI = {
    getCategory,
    getProductList,
    getProductDetail,
    getProductsAndOrder
}
