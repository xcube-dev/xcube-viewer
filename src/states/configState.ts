import { VIEWER_API_SERVER_URL, VIEWER_APP_NAME } from "../config";

export interface ConfigState {
    appName: string;
    apiServerUrl: string;
}

export function newConfigState() {
    return {
        appName: VIEWER_APP_NAME,
        apiServerUrl: VIEWER_API_SERVER_URL,
    }
}