import { DEFAULT_APP_NAME, DEFAULT_API_SERVER_URL } from "../config/config";

export interface ConfigState {
    appName: string;
    apiServerUrl: string;
}

export function newConfigState() {
    return {
        appName: DEFAULT_APP_NAME,
        apiServerUrl: DEFAULT_API_SERVER_URL,
    }
}