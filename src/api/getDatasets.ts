import { callJsonApi } from './callApi';
import { Dataset } from '../model/dataset';

export function getDatasets(apiServerUrl: string): Promise<Dataset[]> {
    return callJsonApi<Dataset[]>(apiServerUrl + '/datasets?details=1&tiles=ol4')
        .then(result => result['datasets']);
}