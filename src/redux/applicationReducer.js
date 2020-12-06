import * as types from './types' 

export const initState = {
    applicationData: {},
};

export const reducer = (state = initState, action) => {
    
    switch (action.type) { 
        case types.STORE_APPLICTION_DATA:
            const key = action.payload.key;
            const data = action.payload.data;
            const result = state;
            result.applicationData[key] = data
            
            return result;
        
        default:
            return { ...state };
             
    }
}

export default reducer;