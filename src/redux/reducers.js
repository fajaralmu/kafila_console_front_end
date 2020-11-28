
import * as userReducer from "./userReducer" 
import * as managementReducer from "./managementReducer"
import * as meetingNotesReducer from "./meetingNotesReducer"

import { combineReducers } from "redux";

export const rootReducer = combineReducers(
    { 
        userState: userReducer.reducer, 
        managementState: managementReducer.reducer,
        meetingNoteState: meetingNotesReducer.reducer
    }
);

export const initialState = { 
    userState: userReducer.initState, 
    managementState: managementReducer.initState,
    meetingNoteState: meetingNotesReducer.initState
}

export default rootReducer;