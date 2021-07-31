import * as actionTypes from "./actionTypes";


export const setTrends = payload => {
    return {
        type: actionTypes.SET_TRENDING_PRODUCTS,
        payload
    }
}

export const setCategory = payload => {
    return {
        type: actionTypes.SET_CATEGORY,
        payload
    }
}

export const setProductList = payload => {
    return {
        type: actionTypes.SET_PRODUCT_LIST,
        payload
    }
}

export const setCartItems = payload => {
    return {
        type: actionTypes.SET_CART_ITEMS,
        payload
    }
}

export const setProductDetail = payload => {
    return {
        type: actionTypes.SET_PRODUCT_DETAIL,
        payload
    }
}

export const setLoginCredentials = payload => {
    return {
        type: actionTypes.SET_LOGIN_CREDENTIALS,
        payload
    }
}

export const addItemToCart = payload => {
    return {
        type: actionTypes.ADD_ITEM_TO_CART,
        payload
    }
}

export const refreshCartItem = () => {
    return {
        type: actionTypes.REFRESH_CART_ITEMS,
    }
}

export const setProgressBar = (payload) => {
    return {
        type: actionTypes.SET_PROGRESS_BAR,
        payload
    }
}

export const updateCartItem = payload => {
    return {
        type: actionTypes.UPDATE_CART_ITEM,
        payload
    }
}

export const deleteCartItem = payload => {
    return {
        type: actionTypes.DELETE_CART_ITEM,
        payload
    }
}

export const setOrderDetail = payload => {
    return {
        type: actionTypes.SET_ORDER_DETAIL,
        payload
    }
}

export const addOrderShipping = payload => {
    return {
        type: actionTypes.ADD_ORDER_SHIPPING,
        payload
    }
}
