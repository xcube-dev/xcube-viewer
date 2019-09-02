import { Dataset } from '../model/dataset';
import { Place, PlaceGroup, } from '../model/place';
import { TimeSeriesGroup } from '../model/timeSeries';
import { ColorBars } from '../model/colorBar';
import { Server } from "../model/server";
import { I18N, VIEWER_API_SERVERS } from "../config";
import { loadUserServers } from './userSettings';


export interface DataState {
    datasets: Dataset[];
    colorBars: ColorBars | null;
    timeSeriesGroups: TimeSeriesGroup[];
    userPlaceGroup: PlaceGroup;
    userServers: Server[];
}

export function newDataState(): DataState {
    const extraUserServers = loadUserServers();
    const userServers = [...VIEWER_API_SERVERS];
    extraUserServers.forEach(extraUserServer => {
        if (!userServers.find(userServer => userServer.id === extraUserServer.id)) {
            userServers.push(extraUserServer);
        }
    });
    return {
        datasets: [],
        colorBars: null,
        timeSeriesGroups: [],
        userPlaceGroup: {
            id: 'user',
            title: I18N.get('My places'),
            type: "FeatureCollection",
            features: [] as Array<Place>
        },
        userServers,
    };
}

