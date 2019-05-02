import { Dataset, } from '../model/dataset';
import { Place, PlaceGroup, } from '../model/place';
import { TimeSeries } from '../model/timeSeries';
import { ColorBars } from '../model/colorBar';
import { Server } from "../model/server";
import { VIEWER_API_SERVERS } from "../config";


export interface DataState {
    datasets: Dataset[];
    colorBars: ColorBars | null;
    timeSeriesCollection: TimeSeries[];
    userPlaces: PlaceGroup;
    userServers: Server[];
}

export function newDataState(): DataState {
    return {
        datasets: [],
        colorBars: null,
        timeSeriesCollection: [],
        userPlaces: {id: 'user', title: 'My places', type: "FeatureCollection", features: [] as Array<Place>},
        userServers: [...VIEWER_API_SERVERS],
    };
}


