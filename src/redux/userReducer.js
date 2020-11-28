import * as types from './types' 
import * as menuData from '../constant/Menus'
import { setCookie } from '../middlewares/Common';
import { setApiToken } from './../middlewares/Common';

export const initState = {
    loginKey: null,
    loginStatus: false,
    loginFailed: false,
    menus: menuData.menus,
    loggedUser: null,
    loginAttempt: false,
    requestId: null,
    applicationProfile: {},
};

export const reducer = (state = initState, action) => {
    /*
        ========setting menu========
    */
    let updatedMenus = new Array();
    if (action.payload) {

        let loggedIn = action.payload && action.payload.loginStatus == true;
        for (let index = 0; index < menuData.menus.length; index++) {
            const menu = menuData.menus[index];
            if (loggedIn && menu.code == menuData.LOGIN) { continue; }

            if (menu.authenticated == false) {
                updatedMenus.push(menu);
            } else {
                if (loggedIn) { updatedMenus.push(menu); }
            }
        }
    }

    switch (action.type) {
        case types.REQUEST_ID:
            result = { ...state, 
                requestId: action.payload.requestId, 
                applicationProfile: action.payload.applicationProfile };
            
            if (action.payload.loggedIn != true) {

                result.loginStatus = false;
                result.loggedUser = null;
            } else {

                if (action.payload.user) {

                    result.loggedUser = action.payload.user;
                    result.loginStatus = action.payload.loggedIn;
                    setApiToken(result.loginKey);
                }else {
                    result.loginStatus = false;
                    result.loggedUser = null;
                }
            } 

            console.debug("o o o result.requestId:", result.requestId)
            //  action.payload.referer.refresh();

            return result;
        case types.DO_LOGIN:
            let result = {
                ...state,
                loginAttempt: true,
                loginStatus: action.payload.loginStatus,
                loginKey: action.payload.loginKey,
                loginFailed: action.payload.loginStatus == false,
                menus: updatedMenus,
                loggedUser: action.payload.loggedUser
            };
            setApiToken(result.loginKey);
            
            return result;
        case types.DO_LOGOUT:
            result = {
                ...state,
                loginStatus: action.payload.loginStatus,
                menus: updatedMenus,
                loggedUser: null
            };
            return result;
        case types.GET_LOGGED_USER:
            result = {
                ...state,
                loggedUser: action.payload.data
            };
            return result;
        default:
            if (action.payload && action.payload.loginStatus != null)
                return { ...state, menus: updatedMenus };
            else {
                return { ...state };
            }
    }
}

export default reducer;