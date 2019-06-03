import * as geojson from 'geojson';

import { Variable } from '../model/variable';
import { TimeSeries } from '../model/timeSeries';
import { callJsonApi } from './callApi';


export function getTimeSeriesForGeometry(apiServerUrl: string,
                                         datasetId: string,
                                         variable: Variable,
                                         featureId: string,
                                         geometry: geojson.Geometry,
                                         startDate: string | null,
                                         endDate: string | null): Promise<TimeSeries | null> {

    let url;
    let queryComponents: Array<[string, string]> | undefined;
    if (geometry.type === "Point") {
        const point = geometry as geojson.Point;
        const coordinate = point.coordinates as [number, number];
        url = apiServerUrl + `/ts/${datasetId}/${variable.name}/point`;
        queryComponents = [
            ['lon', `${coordinate[0]}`],
            ['lat', `${coordinate[1]}`]
        ];
        if (startDate) {
            queryComponents.push(['startDate', startDate]);
        }
        if (endDate) {
            queryComponents.push(['endDate', endDate]);
        }
    }
    if (!url) {
        console.warn(`geometry type not yet supported for time series: "${geometry.type}"`);
        return Promise.resolve(null);
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
            featureId,
            geometry,
        };
        return {source, data, color: "green"};
    };

    return callJsonApi<TimeSeries>(url, queryComponents)
        .then(convertTimeSeriesResult);
}
