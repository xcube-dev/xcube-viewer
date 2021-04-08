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

import createAuth0Client from '@auth0/auth0-spa-js';
import Auth0Client from '@auth0/auth0-spa-js/dist/typings/Auth0Client';
import history from './history';

export type IdToken = { [name: string]: any };
export type AuthClient = Auth0Client;

export interface AuthClientConfig {
    domain: string;
    clientId: string;
    audience: string;
}

let _authClientConfig: AuthClientConfig | null = null;
let _authClient: AuthClient | null = null;

if (process.env.REACT_APP_OAUTH2_DOMAIN
    && process.env.REACT_APP_OAUTH2_CLIENT_ID
    && process.env.REACT_APP_OAUTH2_AUDIENCE) {
    _authClientConfig = {
        domain: process.env.REACT_APP_OAUTH2_DOMAIN,
        clientId: process.env.REACT_APP_OAUTH2_CLIENT_ID,
        audience: process.env.REACT_APP_OAUTH2_AUDIENCE,
    };
}

export function getAuthClient(): AuthClient | null {
    return _authClient;
}

export async function initAuthClient(): Promise<AuthClient | null> {
    if (!_authClientConfig) {
        return Promise.resolve(null);
    }
    if (!_authClient) {
        _authClient = await createAuth0Client({
                                                  domain: _authClientConfig.domain,
                                                  client_id: _authClientConfig.clientId,
                                                  audience: _authClientConfig.audience,
                                                  redirect_uri: window.location.origin,
                                              });
        /*
        try {
            let isAuthenticated = await _authClient.isAuthenticated();
            if (process.env.NODE_ENV === 'development') {
                console.debug('isAuthenticated:', isAuthenticated);
            }
        } catch (e) {
            console.error(e);
        }
        try {
            let user = await _authClient.getUser();
            if (process.env.NODE_ENV === 'development') {
                console.debug('user:', user);
            }
        } catch (e) {
            console.error(e);
        }
        try {
            let token = await _authClient.getTokenSilently();
            if (process.env.NODE_ENV === 'development') {
                console.debug('token:', token);
            }
        } catch (e) {
            console.error(e);
        }
        */
        if (window.location.search.includes('code=')) {
            const {appState} = await _authClient.handleRedirectCallback();
            handleRedirectCallback(appState);
        }
    }
    return _authClient;
}

// A function that routes the user to the right place after login
const handleRedirectCallback = (appState: any) => {
    if (appState && appState.targetUrl) {
        history.push(appState.targetUrl);
    } else {
        history.push(window.location.pathname);
    }
};

