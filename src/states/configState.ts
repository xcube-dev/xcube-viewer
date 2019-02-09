import { DEFAULT_API_SERVER_URL } from "../api/config";

export interface ConfigState {
    apiServerUrl: string;
}

export function newConfigState() {
    return {
        apiServerUrl: DEFAULT_API_SERVER_URL,
    }
}