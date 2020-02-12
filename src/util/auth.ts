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

export function getAuthClientConfig(): AuthClientConfig | null {
    return _authClientConfig;
}

export function getAuthClient(): AuthClient | null {
    return _authClient;
}

export async function initAuthClient(idTokenHint?: string): Promise<AuthClient | null> {
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

        try {
            let isAuthenticated = await _authClient.isAuthenticated();
            console.log('isAuthenticated:', isAuthenticated);
        } catch (e) {
            console.error(e);
        }
        try {
            let user = await _authClient.getUser();
            console.log('user:', user);
        } catch (e) {
            console.error(e);
        }
        try {
            let token = await _authClient.getTokenSilently();
            console.log('token:', token);
        } catch (e) {
            console.error(e);
        }
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

