import { createStore, applyMiddleware } from 'redux'
import { initialState, rootReducer } from './reducers'
import * as types from './types';
import * as userMiddleware from '../middlewares/UserMiddleware'
import * as meetingNoteMiddleware from '../middlewares/MeetingNoteMiddleware'
import * as common from '../middlewares/Common';
import { commonAuthorizedHeader } from './../middlewares/Common';

const POST_METHOD = "POST";

export const configureStore = () => {
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(  

            //user related
            userMiddleware.performLoginMiddleware,
            userMiddleware.performLogoutMiddleware,
            userMiddleware.refreshLoginStatusMiddleware,
            userMiddleware.requestAppIdMiddleware,
            //meeting notes
            meetingNoteMiddleware.getMeetingNotesMiddleware, 

            /*enntity management*/
            // managementMiddleware.getEntityListMiddleware,
            // managementMiddleware.getEntityByIdMiddleware,
            // managementMiddleware.updateEntityMiddleware,
            // managementMiddleware.removeManagedEntityMiddleware, 
            // managementMiddleware.getEntitiesWithCallbackMiddleware,
            // managementMiddleware.getEntityPropertyMiddleware,
            // managementMiddleware.getManagementMenusMiddleware,

            /*realtime chat*/
            // realtimeChatMiddleware.storeChatMessageLocallyMiddleware,
            // realtimeChatMiddleware.getMessagesMiddleware,

        )
    );

    return store;
}  

export default configureStore;