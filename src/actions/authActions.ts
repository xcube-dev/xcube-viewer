import { AppState } from '../states/appState';
import { Dispatch } from 'redux';

type IdToken = { [name: string]: any };

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function requestSignIn() {
    return (dispatch: Dispatch<StartSignIn | ReceiveSignIn>, getState: () => AppState) => {
        dispatch(startSignIn());
        // use auth0 client to bring up login popup, then
        const idToken = {};
        dispatch(receiveSignIn(idToken));
    };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const START_SIGN_IN = 'START_SIGN_IN';
export type START_SIGN_IN = typeof START_SIGN_IN;

export interface StartSignIn {
    type: START_SIGN_IN;
}

export function startSignIn(): StartSignIn {
    return {type: START_SIGN_IN};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const RECEIVE_SIGN_IN = 'RECEIVE_SIGN_IN';
export type RECEIVE_SIGN_IN = typeof RECEIVE_SIGN_IN;

export interface ReceiveSignIn {
    type: RECEIVE_SIGN_IN;
    idToken: IdToken;
}

export function receiveSignIn(idToken: IdToken): ReceiveSignIn {
    return {type: RECEIVE_SIGN_IN, idToken};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function requestSignOut() {
    return (dispatch: Dispatch<StartSignOut | ReceiveSignOut>, getState: () => AppState) => {
        dispatch(startSignOut());
        // use auth0 client to log out, then
        dispatch(receiveSignOut());
    };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const START_SIGN_OUT = 'START_SIGN_OUT';
export type START_SIGN_OUT = typeof START_SIGN_OUT;

export interface StartSignOut {
    type: START_SIGN_OUT;
}

export function startSignOut(): StartSignOut {
    return {type: START_SIGN_OUT};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const RECEIVE_SIGN_OUT = 'RECEIVE_SIGN_OUT';
export type RECEIVE_SIGN_OUT = typeof RECEIVE_SIGN_OUT;

export interface ReceiveSignOut {
    type: RECEIVE_SIGN_OUT;
}

export function receiveSignOut(): ReceiveSignOut {
    return {type: RECEIVE_SIGN_OUT};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type AuthAction = StartSignIn | ReceiveSignIn | StartSignOut | ReceiveSignOut;
