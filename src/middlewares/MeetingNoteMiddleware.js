import * as common from './Common'
import * as types from '../redux/types'

const POST_METHOD = "post";

export const getMeetingNotesMiddleware = store => next => action => {
    if (!action.meta || action.meta.type !== types.GET_MEETING_NOTES) {
        return next(action);
    }
    const app = action.meta.app;
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload), headers: common.commonAuthorizedHeader()
    })
        .then(response => response.json())
        .then(response => {
            let newAction = Object.assign({}, action, {
                payload: {
                    ...response
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

export const storeMeetingNote = store => next => action => {
    if (!action.meta || action.meta.type !== types.STORE_MEETING_NOTES) {
        return next(action);
    }
    const app = action.meta.app;
    fetch(action.meta.url, {
        method: POST_METHOD, body: JSON.stringify(action.payload), headers: common.commonAuthorizedHeader()
    })
        .then(response => { return Promise.all([response.json()]); })
        .then(response => {
            alert("Success storeMeetingNote");
        })
        .catch(err => { alert("Error storeMeetingNote");console.log(err) })
        .finally(param => {
            app.endLoading();  
        });

}