import { createStore, applyMiddleware } from 'redux'
import { initialState, rootReducer } from './reducers'
import * as types from './types';
import * as userMiddleware from '../middlewares/UserMiddleware'
import * as managementMiddleware from '../middlewares/ManagementMiddleware'
import * as realtimeChatMiddleware from '../middlewares/RealtimeChatMiddleware'
import * as catalogMiddleware from '../middlewares/CatalogMiddleware'
import * as common from '../middlewares/Common';
import { commonAuthorizedHeader } from './../middlewares/Common';

const POST_METHOD = "POST";

export const configureStore = () => {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(  
            catalogMiddleware.removeEntityMiddleware,   
            catalogMiddleware.updateCartMiddleware, 

            //user related
            userMiddleware.performLoginMiddleware,
            userMiddleware.performLogoutMiddleware,
            userMiddleware.refreshLoginStatusMiddleware,
            userMiddleware.requestAppIdMiddleware, 
            userMiddleware.getLoggedUserMiddleware, 

            //transaction   
            getCashflowInfoMiddleware,
            getCashflowDetailMiddleware,
            getProductSalesMiddleware,
            resetProductsMiddleware,   
            getProductSalesDetailMiddleware,  

            /*enntity management*/
            managementMiddleware.getEntityListMiddleware,
            managementMiddleware.getEntityByIdMiddleware,
            managementMiddleware.updateEntityMiddleware,
            managementMiddleware.removeManagedEntityMiddleware, 
            managementMiddleware.getEntitiesWithCallbackMiddleware,
            managementMiddleware.getEntityPropertyMiddleware,
            managementMiddleware.getManagementMenusMiddleware,

            /*realtime chat*/
            realtimeChatMiddleware.storeChatMessageLocallyMiddleware,
            realtimeChatMiddleware.getMessagesMiddleware,

        )
    );

    return store;
}
  
  

const getProductSalesDetailMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_PRODUCT_SALES_DETAIL) { return next(action); }
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: commonAuthorizedHeader()
    })
    .then(response => response.json())
    .then(data => {
        console.debug("getProductSalesDetailMiddleware Response:", data);
        if (data.code != "00") {
            alert("Server error");
            return;
        }

        let newAction = Object.assign({}, action, { payload: data });
        delete newAction.meta;
        store.dispatch(newAction);
    })
    .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

const getProductSalesMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_PRODUCT_SALES) { return next(action); }
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: commonAuthorizedHeader()
    }).then(response => response.json())
        .then(data => {
            console.debug("getProductSalesMiddleware Response:", data, "load more:", action.meta.loadMore);
            if (data.code != "00") {
                alert("Server error");
                return;
            }

            let newAction = Object.assign({}, action, { payload: data, loadMore: action.meta.loadMore, referrer: action.meta.referrer });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param => action.meta.referrer.props.app.endLoading());
}

const getCashflowDetailMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_CASHFLOW_DETAIL) { return next(action); }
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: commonAuthorizedHeader()
    }).then(response => response.json())
        .then(data => {
            console.debug("getCashflowDetailMiddleware Response:", data);
            if (data.code != "00") {
                alert("Server error");
                return;
            }

            let newAction = Object.assign({}, action, { payload: data });
            delete newAction.meta;
            store.dispatch(newAction);
        })
        .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}

const getCashflowInfoMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_CASHFLOW_INFO) { return next(action); }
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload),
        headers: commonAuthorizedHeader()
    })
    .then(response => response.json())
    .then(data => {
        console.debug("getCashflowInfoMiddleware Response:", data);
        if (data.code != "00") {
            alert("Server error");
            return;
        }

        if (data.entity == null) {
            alert("Data for cashflow: " + action.payload.filter.module + " in " + action.payload.filter.month + "/" + action.payload.filter.year + " period not found!");
            return;
        }

        if (data.entity.amount == null) {
            data.entity.amount = 0;
            data.entity.count = 0;
            console.log("DATA:", data);
        }
        let newAction = Object.assign({}, action, { payload: data });
        delete newAction.meta;
        store.dispatch(newAction);
    })
    .catch(err => console.log(err)).finally(param => action.meta.app.endLoading());
}
   
const resetProductsMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.RESET_PRODUCTS) { return next(action); }
    let newAction = Object.assign({}, action, { payload: null });
    delete newAction.meta;
    store.dispatch(newAction);
}

export default configureStore;