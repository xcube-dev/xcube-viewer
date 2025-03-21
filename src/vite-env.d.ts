/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly XCV_OAUTH2_AUTHORITY?: string;
  readonly XCV_OAUTH2_CLIENT_ID?: string;
  readonly XCV_OAUTH2_AUDIENCE?: string;
  readonly XCV_APP_SERVER_ID?: string;
  readonly XCV_SERVER_NAME?: string;
  readonly XCV_SERVER_URL?: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
