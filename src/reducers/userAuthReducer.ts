import {
    INIT_AUTH_CLIENT,
    REQUEST_SIGN_IN,
    REQUEST_SIGN_OUT,
    RECEIVE_SIGN_IN,
    RECEIVE_SIGN_OUT,
    UserAuthAction
} from '../actions/userAuthActions';
import { newUserAuthState, UserAuthState, UserAuthStatus } from '../states/userAuthState';


export function userAuthReducer(state: UserAuthState | undefined, action: UserAuthAction): UserAuthState {
    if (state === undefined) {
        state = newUserAuthState();
    }
    switch (action.type) {
        case INIT_AUTH_CLIENT:
            return {...state, hasAuthClient: action.hasAuthClient};
        case REQUEST_SIGN_IN:
            return {...state, status: UserAuthStatus.REQUESTING_SIGN_IN};
        case REQUEST_SIGN_OUT:
            return {...state, status: UserAuthStatus.REQUESTING_SIGN_OUT};
        case RECEIVE_SIGN_IN:
            return {
                ...state,
                status: UserAuthStatus.SIGNED_IN,
                idToken: action.idToken,
                accessToken: action.accessToken,
            };
        case RECEIVE_SIGN_OUT:
            return {
                ...state,
                status: UserAuthStatus.NOT_SIGNED_IN,
                idToken: null,
                accessToken: null,
            };
    }
    return state!;
}

