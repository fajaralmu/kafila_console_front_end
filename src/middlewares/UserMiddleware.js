import * as common from './Common'
import * as types from '../redux/types'

const POST_METHOD = "post";

export const performLoginMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.DO_LOGIN) {
        return next(action);
    }
    const app = action.meta.app;
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload), headers: common.commonAuthorizedHeader()
    })
        .then(response => { return Promise.all([response.json(), response]); })
        .then(([responseJson, response]) => {

            let loginKey = responseJson.user.api_token;
            let loginSuccess = true;
            let newAction = Object.assign({}, action, {
                payload: {
                    loginStatus: loginSuccess,
                    loginKey: loginKey,
                    loggedUser: responseJson.user
                }
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => { console.log(err) })
        .finally(param => {
            app.endLoading();  
        });

}

export const requestAppIdMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REQUEST_ID) { return next(action); }

    let headers = common.commonAuthorizedHeader(); 

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: headers
    }).then(response => { return Promise.all([response.json(), response]); })
    .then(([responseJson, response]) => {

            console.debug("Request App Id Middleware Response:", responseJson);
            let loginKey = "";
            let requestId = responseJson.message;
            if (responseJson.user) {
                loginKey = responseJson.user.api_token;
            }

            let newAction = Object.assign({}, action, { payload: {loginStatus: responseJson.loggedIn, loginKey:loginKey, requestId:requestId, ...responseJson }});
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

export const getLoggedUserMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_LOGGED_USER) { return next(action); }

    let headers = common.commonAuthorizedHeader(); 

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: headers
    }).then(response => response.json())
        .then(data => {
            console.debug("getLoggedUserMiddleware Response:", data);
            
            if (!data) {
                alert("Error performing request");
                return;
            }

            let newAction = Object.assign({}, action, { payload: { data }});
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param =>{ 
            action.meta.app.endLoading();
            action.meta.app.refresh();
        });
}

export const refreshLoginStatusMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.REFRESH_LOGIN) {
        return next(action);
    } 

}

export const performLogoutMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.DO_LOGOUT) {
        return next(action);
    }
    const app = action.meta.app;

    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: { 'Content-Type': 'application/json', 'requestId': localStorage.getItem("requestId"), 'loginKey': localStorage.getItem("loginKey") }
    })
        .then(response => { return Promise.all([response.json(), response]); })
        .then(([responseJson, response]) => {
            let logoutSuccess = false;
            if (responseJson.code == "00") {
                logoutSuccess = true;
            }else{
                alert("Logout Failed");
            }

            let newAction = Object.assign({}, action, {
                payload: {
                    loginStatus: !logoutSuccess
                }
            });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => { console.log(err) })
        .finally(param => app.endLoading());

}