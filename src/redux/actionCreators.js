import * as types from './types'
import * as url from '../constant/Url'

const usedHost = url.contextPath();
const apiEntityBaseUrl = usedHost + "api/entity/"
const apiAccount = usedHost + "api/account/"
const apiAccountDashboard = usedHost + "api/accountdashboard/"
const apiAdmin = usedHost + "api/admin/"
const apiNotes = usedHost + "api/notes/"
 
export const updateCart = (cart, app) => {
    return { type: types.UPDATE_CART, payload: { cart: cart, app: app }, meta: { type: types.UPDATE_CART } };
}

export const resetProducts = () => {
    return { type: types.RESET_PRODUCTS, payload: {}, meta: { type: types.RESET_PRODUCTS } };
} 

export const removeManagedEntity = () => {
    return {
        type: types.REMOVE_MANAGED_ENTITY,
        payload: {},
        meta: { type: types.REMOVE_MANAGED_ENTITY }
    };
}

export const updateEntity = (request, referer, callback) => {
    referer.props.app.startLoading();
    let requested = {
        type: types.UPDATE_ENTITY,
        payload: {
            "entity": request.entityName
        },
        meta: {
            type: types.UPDATE_ENTITY,
            url: request.isNewRecord ? apiEntityBaseUrl.concat("add") : apiEntityBaseUrl.concat("update"),
            app: referer.props.app,
            callback: callback,
            referer: referer
        }
    };
    requested.payload[request.entityName] = request.entity;
    return requested;
}

export const getEntitiesWithCallback = (request, referer, callback) => {
    referer.props.app.startLoading();
    let requested = {
        type: types.GET_ENTITY_WITH_CALLBACK,
        payload: {
            "entity": request.entityName,
            "filter": {
                "limit": 10,
                'fieldsFilter': {}
            }
        },
        meta: {
            type: types.GET_ENTITY_WITH_CALLBACK,
            url: apiEntityBaseUrl.concat("get"),
            app: referer.props.app,
            referer: referer,
            callback: callback
        }
    };
    requested.payload.filter.fieldsFilter[request.fieldName] = request.fieldValue;
    return requested;
}

export const getEntityById = (name, id, app) => {
    app.startLoading();
    let requested = {
        type: types.GET_ENTITY_BY_ID,
        payload: {
            "entity": name,
            "filter": {
                "limit": 1,
                "page": 0,
                "exacts": true,
                "contains": false,
                "fieldsFilter": { "id": id }
            }
        },
        meta: {
            type: types.GET_ENTITY_BY_ID,
            url: apiEntityBaseUrl.concat("get"),
            app: app
        }
    };
    return requested;
}

export const getEntityList = (request, app) => {
    app.startLoading();
    let requested = {
        type: types.GET_ENTITY,
        payload: {
            entity: request.entityName,
            filter: {
                limit: request.limit,
                page: request.page,
                fieldsFilter: request.fieldsFilter,
                orderBy: request.orderBy,
                orderType: request.orderType,
            },

        },
        meta: {
            type: types.GET_ENTITY,
            url: apiEntityBaseUrl.concat("get"),
            app: app,
            entityConfig: request.entityConfig
        }
    };
    return requested;
}


export const getEntityProperty = (entityName, app) => {
    app.startLoading();
    let requested = {
        type: types.GET_ENTITY_PROPERTY,
        payload: {
            entity: entityName
        },
        meta: {
            type: types.GET_ENTITY_PROPERTY,
            url: apiEntityBaseUrl.concat("config"),
            app: app,
        }
    };
    return requested;
}
export const getLoggedUser = (app) => {
    app.startLoading();
    let request = {
        type: types.GET_LOGGED_USER,
        payload: {},
        meta: { type: types.GET_LOGGED_USER, url: apiAccount.concat("user"), app: app }
    };
    return request;
}

export const refreshLoginStatus = () => {

    let loginRequest = {
        type: types.REFRESH_LOGIN,
        payload: {},
        meta: { type: types.REFRESH_LOGIN }
    };
    return loginRequest;
} 
  
export const removeEntity = () => ({
    type: types.REMOVE_SHOP_ENTITY,
    payload: {},
    meta: { type: types.REMOVE_SHOP_ENTITY }
})

export const accountAction = {

    requestAppId : (app) => {
        app.startLoading();
        return {
            type: types.REQUEST_ID,
            payload: {},
            meta: {
                app: app, type: types.REQUEST_ID,
                url: apiAccountDashboard.concat("user")
            }
        };
    },
    performLogout : (app) => {
        app.startLoading();
        let loginRequest = {
            type: types.DO_LOGOUT,
            payload: {},
            meta: { app: app, type: types.DO_LOGOUT, url: apiAccountDashboard.concat("logout") }
        };
        return loginRequest;
    },
    performLogin : (email, password, app) => {
        app.startLoading();
        let loginRequest = {
            type: types.DO_LOGIN,
            payload: {
                user: { email: email, password: password }
            },
            meta: { type: types.DO_LOGIN, url: apiAccount.concat("login"), app: app }
        };
        return loginRequest;
    }
}

export const meetingNotesAction = {
    store: (meetingNote, app) => {
        app.startLoading();
        let requested = {
            type: types.STORE_MEETING_NOTES,
            payload: {
                meeting_note:meetingNote    
            },
            meta: {
                type: types.STORE_MEETING_NOTES,
                url: apiNotes.concat("store"),
                app: app,
            }
        };
        return requested;
    },
    list : (request, app) => {
        app.startLoading();
        
        const filter =  request.fieldsFilter;
        console.debug("request.fieldsFilter: ", filter);
        let requested = {
            type: types.GET_MEETING_NOTES,
            payload: {
                filter: {
                    limit: request.limit,
                    page: request.page,
                    fieldsFilter: filter,
                    orderBy: request.orderBy,
                    orderType: request.orderType,
                },
            },
            meta: {
                type: types.GET_MEETING_NOTES,
                url: apiNotes.concat("list"),
                app: app,
            }
        };
        return requested;
    }

}
 

