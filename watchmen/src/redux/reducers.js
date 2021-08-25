import * as actionTypes from "./actionTypes";



export const login = (
    state = {
        login: false,
        uid: {},
        auth_token: ""
    },
    action
) => {
    switch(action.type){
        case actionTypes.SET_LOGIN_CREDENTIALS:
            state = {login: true, uid:{...action.payload.user}, auth_token:action.payload.token}
            return state;
        default:
            return state;
    }
}


export const trendingWatches = (
    state = {
        trends:[]
    },
    action
) => {
    switch(action.type){
        case actionTypes.SET_TRENDING_PRODUCTS:
            state = {...state, trends:[...action.payload]}
            return state;
        default:
            return state;
    }
}

export const category = (
    state = {
        category: []
    },
    action
) => {
    switch(action.type){
        case actionTypes.SET_CATEGORY:
            state = {...state, category:[...action.payload]};
            return state;
        default:
            return state;
    }
}

export const products = (
    state = {
        products: []
    },
    action
) => {
    switch(action.type){
        case actionTypes.SET_PRODUCT_LIST:
            state = {...state, products:[...action.payload]}
            return state;
        default:
            return state;
    }
}

export const cartItems = (
    state = {
        cart:[],
        order_id: null
    },
    action
) => {
    switch(action.type){
        case actionTypes.SET_CART_ITEMS:
            state = {...state, cart:[...action.payload]}
            return state;
        case actionTypes.ADD_ITEM_TO_CART:
            let new_cart = state.cart;
            new_cart.unshift(action.payload)
            state = {...state, cart:[...new_cart], order_id: action.payload.order_detail}
            return state;
        case actionTypes.UPDATE_QUANTITY_AND_NET_TOTAL:
            let copy_cart = state.cart;
            let ind = copy_cart.findIndex(item=>item.item === action.payload.item);
            copy_cart.splice(ind, 1, action.payload)
            state = {...state, cart:[...copy_cart]}
            return state;
        case actionTypes.UPDATE_CART_ITEM:
            let new_state = state.cart;
            let index = new_state.findIndex(item=> item.id === action.payload.id);
            new_state.splice(index, 1, action.payload)
            state = {...state, cart:[...new_state]}
            return state;
        case actionTypes.DISPATCH_UPDATE:
            let cart3 = state.cart;
            let index3 = cart3.findIndex(item=> item.item === action.payload.item);
            cart3.splice(index3, 1, action.payload)
            return {...state, cart:[...cart3]}
        case actionTypes.DELETE_CART_ITEM:
            let cart_items = state.cart;
            let i = cart_items.findIndex(item=> item.id === action.payload);
            cart_items.splice(i, 1);
            state = {...state, cart:[...cart_items]}
            return state;
        case actionTypes.DISPATCH_DELETE_CART_ITEM:
            let cart2 = state.cart;
            let index2 = cart2.findIndex(item=> item.item === action.payload);
            cart2.splice(index2, 1);
            state = {...state, cart: [...cart2]}
            return state;
        default:
            return state;
    }
}

export const productDetail = (
    state = {
        product: {}
    },
    action
) => {
    switch(action.type){
        case actionTypes.SET_PRODUCT_DETAIL:
            state = {...state, product: {...action.payload}}
            return state;
        default:
            return state;
    }
}

export const progress = (
    state = {
        progress: 0,
    },
    action
) => {
    switch(action.type){
        case actionTypes.SET_PROGRESS_BAR:
            state = {...state, progress:action.payload}
            return state;
        default:
            return state;
    }
}


export const orderDetail = (
    state = {
        order: {},
        payment: ""
    },
    action
) => {
    switch(action.type){
        case actionTypes.SET_ORDER_DETAIL:
            state = {...state, order:{...action.payload}}
            return state;
        case actionTypes.ADD_ORDER_SHIPPING:
            state = {...state, order:{...action.payload}};
            return state;
        case actionTypes.SET_PAYMENT_MEANS:
            state = {...state, payment: action.payload}
            return state;
        default:
            return state;
    }
}


export const orderPlaced = (
    state = {
        placed: {}
    },
    action
) => {
    switch(action.type){
        case actionTypes.SET_PLACED_ORDER:
            state = {...state, placed:action.payload}
            return state;
        default:
            return state;
    }
}


export const promptSMS = (
    state = {
        status: {}
    },
    action
) => {
    switch(action.type){
        case actionTypes.SENDING_STK_PROMPT:
            state = {...state, status: action.payload}
            return state;
        default:
            return state;
    }
}

