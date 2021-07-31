import { createStore, combineReducers, applyMiddleware } from "redux";
import { persistReducer } from "redux-persist";
import storage from 'redux-persist/lib/storage'
import thunk from "redux-thunk";

import {
    trendingWatches,
    category,
    products,
    cartItems,
    productDetail,
    login,
    progress,
    orderDetail
} from "./reducers";

const persistConfig = {
    key: 'root',
    storage
}

let rootReducers = combineReducers({
    trendingWatches,
    category,
    products,
    cartItems,
    productDetail,
    login,
    progress,
    orderDetail
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = createStore(persistedReducer, applyMiddleware(thunk));
