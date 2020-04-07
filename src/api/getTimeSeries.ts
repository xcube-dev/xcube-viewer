import * as geojson from 'geojson';

import { Variable } from '../model/variable';
import { TimeSeries, TimeSeriesPoint } from '../model/timeSeries';
import { callJsonApi, makeRequestInit, makeRequestUrl, QueryComponent } from './callApi';


export function getTimeSeriesForGeometry(apiServerUrl: string,
                                         datasetId: string,
                                         variable: Variable,
                                         placeId: string,
                                         geometry: geojson.Geometry,
                                         startDate: string | null,
                                         endDate: string | null,
                                         useMedian: boolean,
                                         inclStDev: boolean,
                                         accessToken: string | null): Promise<TimeSeries | null> {

    let valueDataKey: keyof TimeSeriesPoint;
    let errorDataKey: keyof TimeSeriesPoint | null = null;
    const query: QueryComponent[] = [];
    if (useMedian) {
        query.push(['aggMethods', 'median']);
        valueDataKey = 'median';
    } else if (inclStDev) {
        query.push(['aggMethods', 'mean,std']);
        valueDataKey = 'mean';
        errorDataKey = 'std';
    } else {
        query.push(['aggMethods', 'mean']);
        valueDataKey = 'mean';
    }
    if (startDate) {
        query.push(['startDate', startDate]);
    }
    if (endDate) {
        query.push(['endDate', endDate]);
    }
    const url = makeRequestUrl(`${apiServerUrl}/timeseries/${datasetId}/${variable.name}`, query);

    const init = {
        ...makeRequestInit(accessToken),
        method: 'post',
        body: JSON.stringify(geometry),
    };

    const convertTimeSeriesResult = (result: { [name: string]: any }) => {
        result = result['result'];
        if (!result || result.length === 0) {
            return null;
        }
        const data = result.map((item: any) => {
            return {...item, time: new Date(item.time).getTime()};
        });
        const source = {
            datasetId,
            variableName: variable.name,
            variableUnits: variable.units || undefined,
            placeId,
            geometry,
            valueDataKey,
            errorDataKey,
        };
        return {source, data, color: "green"};
    };

    return callJsonApi<TimeSeries>(url, init)
        .then(convertTimeSeriesResult);
}
