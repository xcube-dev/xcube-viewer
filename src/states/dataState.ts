import { Dataset, } from '../model/dataset';
import { Place, PlaceGroup, } from '../model/place';
import { TimeSeries } from '../model/timeSeries';
import { ColorBars } from '../model/colorBar';


export interface DataState {
    datasets: Dataset[];
    colorBars: ColorBars | null;
    userPlaces: PlaceGroup;
    timeSeriesCollection: TimeSeries[];
}

export function newDataState(): DataState {
    return {
        datasets: [],
        colorBars: null,
        userPlaces: {id: 'user', title: 'My places', type: "FeatureCollection", features: [] as Array<Place>},
        timeSeriesCollection: [],
    };
}


