import * as types from './types' 
import * as menuData from '../constant/Menus'
import { setCookie } from '../middlewares/Common';
import { setApiToken } from './../middlewares/Common';

export const initState = {
    loginKey: null,
    loginStatus: false,
    loginFailed: false, 
    loggedUser: null,
    loginAttempt: false,
    requestId: null,
    lastLoginAttempt:new Date(),
    applicationProfile: {},
};

export const reducer = (state = initState, action) => {
    /*
        ========setting menu========
    */
    switch (action.type) {
        case types.REQUEST_ID:
            result = { ...state, 
                requestId: action.payload.requestId, 
                applicationProfile: action.payload.applicationProfile };
            
            if (action.payload.loginStatus != true) {

                result.loginStatus = false;
                result.loggedUser = null;
            } else {

                if (action.payload.user) {

                    result.loggedUser = action.payload.user;
                    result.loginStatus = true;
                    setApiToken(result.loggedUser.api_token);
                }else {
                    result.loginStatus = false;
                    result.loggedUser = null;
                }
            }

            return result;
        case types.DO_LOGIN:
            if (!action.payload.loginStatus) {
                return { ...state, lastLoginAttempt:new Date(), loginFailed: true }
            }
            let result = {
                ...state,
                lastLoginAttempt:new Date(),
                loginAttempt: true,
                loginStatus: action.payload.loginStatus,
                loginKey: action.payload.loginKey,
                loginFailed: false, 
                loggedUser: action.payload.loggedUser
            };
            setApiToken(result.loginKey);
            
            return result;
        case types.DO_LOGOUT:
            result = {
                ...state,
                loginStatus: action.payload.loginStatus, 
                loggedUser: null
            };
            return result;
        default:
           return { ...state };
    }
}

export default reducer;