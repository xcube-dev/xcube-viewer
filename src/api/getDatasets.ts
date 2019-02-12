import { callJsonApi } from "./callApi";
import { Dataset } from "../types/dataset";

export function getDatasets(apiServerUrl: string): Promise<Dataset[]> {
    return callJsonApi<Dataset[]>(apiServerUrl + '/datasets').then(result => result["datasets"]);
}