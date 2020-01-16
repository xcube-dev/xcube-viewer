import React, { useState, useEffect, useContext, ReactNode } from 'react';
import createAuth0Client from '@auth0/auth0-spa-js';

const DEFAULT_REDIRECT_CALLBACK = () =>
    window.history.replaceState({}, document.title, window.location.pathname);

interface Auth0ProviderContext {
    isAuthenticated: boolean;
    user: IdToken;
    token: any;
    loading: boolean;
    popupOpen: boolean;
    loginWithPopup: any;
    handleRedirectCallback: any;
    getIdTokenClaims: (...p: any) => any;
    loginWithRedirect: (...p: any) => any;
    getTokenSilently: (...p: any) => any;
    getTokenWithPopup: (...p: any) => any;
    logout: (...p: any) => any;
}

interface Auth0ProviderProps extends Auth0ClientOptions {
    children?: ReactNode;
    onRedirectCallback?: (result?: RedirectLoginResult) => void;
}

export interface AuthConfig {
    domain: string;
    clientId: string;
    audience: string;
}

let auth0Config: AuthConfig | null = null;
if (process.env.REACT_APP_AUTH0_DOMAIN
    && process.env.REACT_APP_AUTH0_CLIENT_ID
    && process.env.REACT_APP_AUTH0_AUDIENCE) {
    auth0Config = {
        domain: process.env.REACT_APP_AUTH0_DOMAIN,
        clientId: process.env.REACT_APP_AUTH0_CLIENT_ID,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    };
}

export function canUseAuth0(): boolean {
    return auth0Config !== null;
}

export function getAuth0Config(): AuthConfig | null {
    return auth0Config;
}

const Auth0Context = React.createContext<Auth0ProviderContext>({} as Auth0ProviderContext);

export const useAuth0 = () => useContext(Auth0Context);

export const Auth0Provider: React.FC<Auth0ProviderProps> = ({
                                                                children,
                                                                onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
                                                                ...initOptions
                                                            }: Auth0ProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState();
    const [user, setUser] = useState();
    const [token, setToken] = useState();
    const [auth0Client, setAuth0] = useState();
    const [loading, setLoading] = useState(true);
    const [popupOpen, setPopupOpen] = useState(false);

    useEffect(() => {
        const initAuth0 = async () => {
            const auth0FromHook = await createAuth0Client(initOptions);
            setAuth0(auth0FromHook);

            if (window.location.search.includes('code=')) {
                const {appState} = await auth0FromHook.handleRedirectCallback();
                onRedirectCallback(appState);
            }

            const isAuthenticated = await auth0FromHook.isAuthenticated();

            setIsAuthenticated(isAuthenticated);

            if (isAuthenticated) {
                const user = await auth0FromHook.getUser();
                setUser(user);
            }

            setLoading(false);
        };
        initAuth0();
        // eslint-disable-next-line
    }, []);

    const loginWithPopup = async (params = {}) => {
        setPopupOpen(true);
        try {
            await auth0Client.loginWithPopup(params);
        } catch (error) {
            console.error(error);
        } finally {
            setPopupOpen(false);
        }
        const user = await auth0Client.getUser();
        const token = await auth0Client.getTokenSilently();
        setUser(user);
        setToken(token);
        setIsAuthenticated(true);
    };

    const handleRedirectCallback = async () => {
        setLoading(true);
        await auth0Client.handleRedirectCallback();
        const user = await auth0Client.getUser();
        const token = await auth0Client.getTokenSilently();
        setLoading(false);
        setIsAuthenticated(true);
        setUser(user);
        setToken(token);
    };

    return (
        <Auth0Context.Provider
            value={{
                isAuthenticated,
                user,
                token,
                loading,
                popupOpen,
                loginWithPopup,
                handleRedirectCallback,
                getIdTokenClaims: (...p: any) => auth0Client.getIdTokenClaims(...p),
                loginWithRedirect: (...p: any) => auth0Client.loginWithRedirect(...p),
                getTokenSilently: (...p: any) => auth0Client.getTokenSilently(...p),
                getTokenWithPopup: (...p: any) => auth0Client.getTokenWithPopup(...p),
                logout: (...p: any) => auth0Client.logout(...p)
            }}
        >
            {children}
        </Auth0Context.Provider>
    );
};
