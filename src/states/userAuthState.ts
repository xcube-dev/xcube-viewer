/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

export interface UserAuthState {
  accessToken: string | null;
}

export function newUserAuthState(): UserAuthState {
  return {
    accessToken: null,
  };
}
