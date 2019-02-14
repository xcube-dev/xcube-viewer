import { callJsonApi } from "./callApi";
import { Dataset } from "../types/dataset";

export function getDatasets(apiServerUrl: string): Promise<Dataset[]> {
    return callJsonApi<Dataset[]>(apiServerUrl + '/datasets?deep=1&tiles=ol4')
        .then(result => result["datasets"]);
}