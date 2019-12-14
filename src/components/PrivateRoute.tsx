// src/components/PrivateRoute.js

import React, { useEffect } from "react";
import { RouteProps } from 'react-router';
import { Route } from "react-router-dom";
import { useAuth0 } from "./Auth0Provider";

interface PrivateRouteProps extends RouteProps {
    component: React.ComponentClass | React.FC;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({component: Component, path, ...rest}) => {
    const {loading, isAuthenticated, loginWithRedirect} = useAuth0();

    useEffect(() => {
        if (loading || isAuthenticated) {
            return;
        }
        const fn = async () => {
            await loginWithRedirect({
                                        appState: {targetUrl: path}
                                    });
        };
        fn();
    }, [loading, isAuthenticated, loginWithRedirect, path]);

    const render = (props: any) => isAuthenticated ? <Component {...props} /> : null;

    return <Route path={path} render={render} {...rest} />;
};

export default PrivateRoute;