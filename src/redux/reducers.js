import * as shopReducer from "./shopReducer"
import * as userReducer from "./userReducer"
import * as transactionReducer from "./transactionReducer"
import * as managementReducer from "./managementReducer"

import { combineReducers } from "redux";

export const rootReducer = combineReducers(
    {
        shopState: shopReducer.reducer,
        userState: userReducer.reducer,
        transactionState: transactionReducer.reducer,
        managementState: managementReducer.reducer
    }
);

export const initialState = {
    shopState: shopReducer.initState,
    userState: userReducer.initState,
    transactionState: transactionReducer.initState,
    managementState: managementReducer.initState
}

export default rootReducer;