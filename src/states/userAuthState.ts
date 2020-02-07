import * as auth from '../util/auth';

export enum UserAuthStatus {
    NOT_SIGNED_IN,
    SIGNED_IN,
    REQUESTING_SIGN_OUT,
    REQUESTING_SIGN_IN,
}

export interface UserAuthState {
    hasAuthClient: boolean | null;
    status: UserAuthStatus;
    idToken: auth.IdToken | null;
    accessToken: string | null;
}

export function newUserAuthState(): UserAuthState {
    return {
        hasAuthClient: null,
        status: UserAuthStatus.NOT_SIGNED_IN,
        idToken: null,
        accessToken: null,
    }
}
