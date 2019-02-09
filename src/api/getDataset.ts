import {Dataset} from "../types/dataset";
import {callJsonApi} from "./callApi";

export function getDataset(apiServerUrl: string, datasetId: string): Promise<Dataset> {
    return callJsonApi<Dataset>(apiServerUrl + '/datasets/'+ datasetId);
}