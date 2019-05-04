import { callJsonApi } from './callApi';
import { Variable } from '../model/variable';
import { TimeSeries } from '../model/timeSeries';
import * as geojson from 'geojson';

export function getTimeSeriesForGeometry(apiServerUrl: string,
                                         datasetId: string,
                                         variable: Variable,
                                         featureId: string,
                                         geometry: geojson.Geometry): Promise<TimeSeries | null> {

    let url;
    if (geometry.type === "Point") {
        const point = geometry as geojson.Point;
        const coordinate = point.coordinates as [number, number];
        url = apiServerUrl + `/ts/${datasetId}/${variable.name}/point?lon=${coordinate[0]}&lat=${coordinate[1]}`;
    }
    if (!url) {
        console.warn(`geometry type not yet supported for time series: "${geometry.type}"`);
        return Promise.resolve(null);
    }

    return callJsonApi<TimeSeries>(url)
        .then(result => {
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
            return {source, data};
        });
}