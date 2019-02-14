import { callJsonApi } from "./callApi";
import { TimeSeries } from "../types/timeSeries";

export function getTimeSeriesForPoint(apiServerUrl: string,
                                      datasetId: string,
                                      variableName: string,
                                      coordinate: [number, number]): Promise<TimeSeries | null> {
    const url = apiServerUrl + `/ts/${datasetId}/${variableName}/point?lon=${coordinate[0]}&lat=${coordinate[1]}`;
    return callJsonApi<TimeSeries>(url)
        .then(result => {
            const results = result["results"];
            if (!results || results.length === 0) {
                return null;
            }
            const data = results.map((item: any) => {
                return {time: item.date, ...item.result};
            });
            const source = {datasetId, variableName, coordinate};
            return {source, data};
        });
}