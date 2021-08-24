import { createStore, combineReducers, applyMiddleware } from "redux";
import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage'
import thunk from "redux-thunk";
import * as actionTypes from "./actionTypes";

import {
    trendingWatches,
    category,
    products,
    cartItems,
    productDetail,
    login,
    progress,
    orderDetail,
    orderPlaced,
    promptSMS
} from "./reducers";

const persistConfig = {
    key: 'root',
    storage
}

let reducer = combineReducers({
    trendingWatches,
    category,
    products,
    cartItems,
    productDetail,
    login,
    progress,
    orderDetail,
    orderPlaced,
    promptSMS
});

const rootReducers = (state, action) => {
    if (action.type === actionTypes.RESET_APP) {
      let { products } = state;
      state = { products };
    }
    return reducer(state, action);
};

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = createStore(persistedReducer, applyMiddleware(thunk));
