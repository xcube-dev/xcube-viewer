import { callJsonApi } from './callApi';
import { PlaceGroup } from '../model/place';


export function getDatasetPlaceGroup(apiServerUrl: string, dsId: string, placeGroupId: string): Promise<PlaceGroup> {
    return callJsonApi<PlaceGroup>(apiServerUrl + `/datasets/${dsId}/places/${placeGroupId}`);
}
