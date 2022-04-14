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

import { UserManager, UserManagerSettings, User, UserProfile as UP} from 'oidc-client-ts';
import history from './history';

export type UserInfo = User;
export type UserProfile = UP;
export type AuthClient = UserManager;
export type AuthClientConfig = UserManagerSettings;


let _authClient: AuthClient | null = null;


export function getAuthClient(): AuthClient | null {
    return _authClient;
}

export async function initAuthClient(authClientConfig?: AuthClientConfig): Promise<AuthClient | null> {
    if (!authClientConfig) {
        return Promise.resolve(null);
    }
    if (!_authClient) {
        _authClient = new UserManager({
            ...authClientConfig,
            redirect_uri: window.location.origin,
            // loadUserInfo: Flag to control if additional identity data is loaded
            // from the user info endpoint in order to populate
            // the user's profile (default: false)
            loadUserInfo: true
        });
        // console.info('window.location:', window.location)
        if (window.location.search.includes('code=')) {
            const user = await _authClient.getUser();
            console.debug('Coming from auth service. User:', user);
            // console.log('Pushing onto history:', window.location.pathname);
            // history.push(window.location.pathname);
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

