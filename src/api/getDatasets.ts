import { callJsonApi } from "./callApi";
import { Dataset } from "../types/dataset";

export function getDatasets(apiServerUrl: string){
    return callJsonApi<Dataset[]>(apiServerUrl + '/datasets');
}