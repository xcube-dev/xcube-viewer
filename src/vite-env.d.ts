/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly XCV_OAUTH2_AUTHORITY: string
  readonly XCV_OAUTH2_CLIENT_ID: string
  readonly XCV_OAUTH2_AUDIENCE: string
  readonly XCV_APP_SERVER_ID: string
  readonly XCV_SERVER_NAME: string
  readonly XCV_SERVER_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
