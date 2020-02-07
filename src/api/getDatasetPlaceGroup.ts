import { callJsonApi, makeRequestInit } from './callApi';
import { PlaceGroup } from '../model/place';


export function getDatasetPlaceGroup(apiServerUrl: string, dsId: string, placeGroupId: string, accessToken: string | null): Promise<PlaceGroup> {
    const init = makeRequestInit(accessToken);
    return callJsonApi<PlaceGroup>(`${apiServerUrl}/datasets/${dsId}/places/${placeGroupId}`, init);
}
