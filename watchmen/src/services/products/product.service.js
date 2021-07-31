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
        if (response) products = response.data;
        return products;
    } catch(error){
        return error.response;
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
    getProductDetail
}
