import * as types from './types' 

export const initState = {
    meetingNoteData: null,
};

export const reducer = (state = initState, action) => {
    
    switch (action.type) { 
        case types.GET_MEETING_NOTES:
            let result = {
                ...state,
                meetingNoteData: action.payload
            };
            console.debug("action.meetingNoteData: ", result.meetingNoteData);
            return result;
        
        default:
            return { ...state };
             
    }
}

export default reducer;