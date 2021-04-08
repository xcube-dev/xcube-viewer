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
                userInfo: action.userInfo,
                accessToken: action.accessToken,
            };
        case RECEIVE_SIGN_OUT:
            return {
                ...state,
                status: UserAuthStatus.NOT_SIGNED_IN,
                userInfo: null,
                accessToken: null,
            };
    }
    return state!;
}

