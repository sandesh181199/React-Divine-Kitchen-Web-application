import * as ActionTypes from './ActionTypes';

export const NewUser = (state = {
    isLoading: false,
    errMess: null,
    userData : [],
}, action) => {
    switch (action.type) {
        case ActionTypes.SIGNIN_REQUEST:
            return { ...state, isLoading: true, errMess : null, userData : action.payload
            };
        case ActionTypes.SIGNIN_SUCCESS:
            return { ...state, isLoading: false,errMess: null, userData : []
            };
        case ActionTypes.SIGNIN_FAILED:
            return { ...state, isLoading: false, errMess: action.payload, userData : []
            };
        default:
            return state
    }
}


