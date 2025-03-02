/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import { AuthProvider } from "react-oidc-context";
import { User } from "oidc-client-ts";

import { Config } from "@/config";
import baseUrl from "@/util/baseurl";
import ErrorBoundary from "./ErrorBoundary";

type AuthWrapperProps = object;

const AuthWrapper: React.FC<React.PropsWithChildren<AuthWrapperProps>> = ({
  children,
}) => {
  const authClient = Config.instance.authClient;
  if (!authClient) {
    return <>{children}</>;
  }

  const handleSigninCallback = (_user: User | void): void => {
    console.info("handleSigninCallback:", _user);
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  const handleRemoveUser = (): void => {
    console.info("handleRemoveUser");
    // go home after logout
    window.location.pathname = "/";
  };

  const redirectUri = baseUrl.href;

  return (
    <ErrorBoundary>
      <AuthProvider
        {...authClient}
        loadUserInfo={true}
        scope="openid email profile"
        automaticSilentRenew={true}
        redirect_uri={redirectUri}
        post_logout_redirect_uri={redirectUri}
        popup_post_logout_redirect_uri={redirectUri}
        onSigninCallback={handleSigninCallback}
        onRemoveUser={handleRemoveUser}
      >
        {children}
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default AuthWrapper;
