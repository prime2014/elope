import { trendsAPI } from "../services/trending/trending.service";
import { productAPI } from "../services/products/product.service";
import { cartAPI } from "../services/cart/cart.service";
import {
    setTrends,
    setCategory,
    setProductList,
    setCartItems,
    setProductDetail,
    setLoginCredentials,
    addItemToCart,
    updateCartItem,
    deleteCartItem,
    setOrderDetail
} from "./actions";
import { accountsAPI } from "../services/accounts/accounts.service";
import { orderAPI } from "../services/order/order.service";

export const dispatchTrends = () => {
    // get the trending products from the backend
    return async dispatch => {
        try {
            let response = await trendsAPI.fetchTrending();
            if (response) dispatch(setTrends(response));
        } catch(error){
            return error;
        }
    }
}


export const dispatchCategory = () => {
    // gets all the product categories from the backend
    return async dispatch => {
        try {
            let response = await productAPI.getCategory();
            if (response) dispatch(setCategory(response))
        } catch(error){
            return error
        }
    }
}

export const dispatchProductList = () => {
    // get all the products from the backend for dispaly
    return async dispatch => {
        try {
            let products = await productAPI.getProductList();
            let category = await productAPI.getCategory();
            if(products && category){
                dispatch(setProductList(products))
                dispatch(setCategory(category))
            }
        } catch(error){
            return error;
        }
    }
}

export const cartItemsDispatch = () => {
    return async dispatch =>{
        try {
            let response = await cartAPI.getCartItems();
            if (response) dispatch(setCartItems(response));
        } catch(error){
            return error;
        }
    }
}

export const dispatchProductDetail = (pk) => {
    // get a single product from the backend
    return async dispatch => {
        try {
            let product = await productAPI.getProductDetail(pk);
            if(product) dispatch(setProductDetail(product));
        } catch(error){
            return error;
        }
    }
}

export const dispatchLoginCredentials = (credentials) => {
    return async dispatch => {
        try {
            let response = await accountsAPI.loginUser(credentials);
            if(response) return dispatch(setLoginCredentials(response));
        } catch(error){
            return error;
        }
    }
}

export const addCartItem = (item) => {
    // adds item to cart in the backend
    return async dispatch => {
        try {
            let response = await cartAPI.addToCart(item);
            if (response) return dispatch(addItemToCart(response));
        } catch(error){
            return error;
        }
    }
}

export const dispatchUpdateCartItem = (pk,product) =>{
    return async dispatch => {
        try {
            let response = await cartAPI.updateCartItem(pk, product);
            if(response) dispatch(updateCartItem(response))
            return response;
        } catch(error){
            return error;
        }
    }
}

export const dispatchDeleteCartItem = pk => {
    return async dispatch => {
        try {
            let response = await cartAPI.deleteCartItem(pk);
            if (response) dispatch(deleteCartItem(pk));
        } catch(error){
            return error;
        }
    }
}

export const dispatchSetOrderDetail = pk => {
    return async dispatch => {
        try {
            let response = await orderAPI.getOrderDetail(pk);
            if (response) dispatch(setOrderDetail(response))
        } catch(error){
            return error;
        }
    }
}
