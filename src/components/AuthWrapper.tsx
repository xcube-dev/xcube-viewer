/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2022 by the xcube development team and contributors.
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

import React from "react";
import { AuthProvider } from "react-oidc-context";
import { User } from "oidc-client-ts";
import { Config } from '../config';


interface AuthWrapperProps {
}

const AuthWrapper: React.FC<React.PropsWithChildren<AuthWrapperProps>> = ({children}) => {
    const authClient = Config.instance.authClient;
    if (!authClient) {
        return <>{children}</>;
    }

    const handleSigninCallback = (_user: User | void): void => {
        console.info("handleSigninCallback:", _user);
        window.history.replaceState(
                {},
                document.title,
                window.location.pathname
        )
    }

    const handleRemoveUser = (): void => {
        console.info("handleRemoveUser");
        // go home after logout
        window.location.pathname = "/";
    }

    return (
            <AuthProvider
                    {...authClient}
                    loadUserInfo={true}
                    automaticSilentRenew={true}
                    redirect_uri={window.location.origin}
                    post_logout_redirect_uri={window.location.origin}
                    popup_post_logout_redirect_uri={window.location.origin}
                    onSigninCallback={handleSigninCallback}
                    onRemoveUser={handleRemoveUser}
            >
                {children}
            </AuthProvider>
    );
}

export default AuthWrapper;
