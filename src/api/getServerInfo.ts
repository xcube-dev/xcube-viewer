import { callJsonApi } from './callApi';
import { ServerInfo } from '../model/server';

export function getServerInfo(apiServerUrl: string): Promise<ServerInfo> {
    return callJsonApi<ServerInfo>(`${apiServerUrl}/`);
}
