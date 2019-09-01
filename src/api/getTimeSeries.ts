import * as geojson from 'geojson';

import { Variable } from '../model/variable';
import { TimeSeries } from '../model/timeSeries';
import { callJsonApi, QueryComponent } from './callApi';


export function getTimeSeriesForGeometry(apiServerUrl: string,
                                         datasetId: string,
                                         variable: Variable,
                                         placeId: string,
                                         geometry: geojson.Geometry,
                                         startDate: string | null,
                                         endDate: string | null,
                                         inclStDev: boolean): Promise<TimeSeries | null> {

    const url = apiServerUrl + `/ts/${datasetId}/${variable.name}/geometry`;
    const init = {
        method: 'post',
        body: JSON.stringify(geometry),
    };
    const queryComponents: QueryComponent[] = [['inclStDev', inclStDev ? '1' : '0']];
    if (startDate) {
        queryComponents.push(['startDate', startDate]);
    }
    if (endDate) {
        queryComponents.push(['endDate', endDate]);
    }

    const convertTimeSeriesResult = (result: { [name: string]: any }) => {
        const results = result['results'];
        if (!results || results.length === 0) {
            return null;
        }
        const data = results.map((item: any) => {
            return {time: new Date(item.date).getTime(), ...item.result};
        });
        const source = {
            datasetId,
            variableName: variable.name,
            variableUnits: variable.units || undefined,
            placeId,
            geometry,
        };
        return {source, data, color: "green"};
    };

    return callJsonApi<TimeSeries>(url, queryComponents, init)
        .then(convertTimeSeriesResult);
}
