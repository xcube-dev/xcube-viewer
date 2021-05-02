/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Dispatch } from 'redux';
import { Config } from '../config';
import * as auth from '../util/auth'
import { updateDatasets } from './dataActions';
import { PostMessage, postMessage } from './messageLogActions';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function initAuthClient() {
    return async (dispatch: Dispatch<InitAuthClient | ReceiveSignIn>) => {
        const authClient = await auth.initAuthClient(Config.instance.authClient);
        dispatch(_initAuthClient(authClient !== null));
        if (authClient !== null) {
            let userInfo = null;
            try {
                userInfo = await authClient.getUser();
            } catch (e) {
                // ok
            }
            let accessToken = null;
            try {
                accessToken = await authClient.getTokenSilently();
            } catch (e) {
                // ok
            }
            if (userInfo && accessToken) {
                dispatch(receiveSignIn(userInfo!, accessToken!));
                dispatch(updateDatasets() as any);
            }
        }
    };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const INIT_AUTH_CLIENT = 'INIT_AUTH_CLIENT';

export interface InitAuthClient {
    type: typeof INIT_AUTH_CLIENT;
    hasAuthClient: boolean;
}

function _initAuthClient(hasAuthClient: boolean): InitAuthClient {
    return {type: INIT_AUTH_CLIENT, hasAuthClient};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function signIn() {
    return (dispatch: Dispatch<RequestSignIn | ReceiveSignIn | ReceiveSignOut | PostMessage>) => {
        const authClient = auth.getAuthClient();
        if (!authClient) {
            // Should never get here...
            return;
        }

        authClient.loginWithPopup()
                  .then(async () => {
                      dispatch(requestSignIn());
                      const userInfo = await authClient.getUser();
                      if (!userInfo) {
                          throw new Error('Signing in failed, failed to retrieve user information.');
                      }
                      const accessToken = await authClient.getTokenSilently();
                      dispatch(receiveSignIn(userInfo!, accessToken));
                      dispatch(updateDatasets() as any);
                  })
                  .catch((error) => {
                      dispatch(receiveSignOut());
                      dispatch(postMessage('error', error));
                  });
    };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const REQUEST_SIGN_IN = 'REQUEST_SIGN_IN';

export interface RequestSignIn {
    type: typeof REQUEST_SIGN_IN;
}

function requestSignIn(): RequestSignIn {
    return {type: REQUEST_SIGN_IN};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const RECEIVE_SIGN_IN = 'RECEIVE_SIGN_IN';

export interface ReceiveSignIn {
    type: typeof RECEIVE_SIGN_IN;
    userInfo: auth.UserInfo;
    accessToken: string;
}

function receiveSignIn(userInfo: auth.UserInfo, accessToken: string): ReceiveSignIn {
    return {type: RECEIVE_SIGN_IN, userInfo, accessToken};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function signOut() {
    return (dispatch: Dispatch<RequestSignOut | ReceiveSignOut>) => {
        const authClient = auth.getAuthClient();
        if (!authClient) {
            // Should never get here...
            return;
        }
        const logoutOptions = {
            returnTo: window.location.origin,
            federated: true,
        };
        dispatch(requestSignOut());
        authClient.logout(logoutOptions);
        dispatch(receiveSignOut());
    };
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const REQUEST_SIGN_OUT = 'REQUEST_SIGN_OUT';

export interface RequestSignOut {
    type: typeof REQUEST_SIGN_OUT;
}

function requestSignOut(): RequestSignOut {
    return {type: REQUEST_SIGN_OUT};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const RECEIVE_SIGN_OUT = 'RECEIVE_SIGN_OUT';

export interface ReceiveSignOut {
    type: typeof RECEIVE_SIGN_OUT;
}

function receiveSignOut(): ReceiveSignOut {
    return {type: RECEIVE_SIGN_OUT};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type UserAuthAction = InitAuthClient | RequestSignIn | ReceiveSignIn | RequestSignOut | ReceiveSignOut;
