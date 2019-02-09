
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const CONFIGURE_SERVER = 'CONFIGURE_SERVER';
export type CONFIGURE_SERVER = typeof CONFIGURE_SERVER;

export interface ConfigureServer {
    type: CONFIGURE_SERVER;
    apiServerUrl: string;
}

export function configureServer(apiServerUrl: string): ConfigureServer {
    return {type: CONFIGURE_SERVER, apiServerUrl};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export type ConfigAction = ConfigureServer;