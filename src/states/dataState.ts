import { Dataset, Variable } from '../types/dataset';
import { Place, PlaceGroup } from '../types/place';

export interface DataState {
    datasets: Dataset[];
    userPlaces: PlaceGroup;
}

export function newDataState(): DataState {
    return {
        datasets: [
            {
                id: 'local',
                title: 'Local HIGHROC OLCI L2C cube for region SNS',
                bbox: [4.0, 48.0, 12.0, 52.0],
                placeGroups: createTestPlaceGroups(),
                variables: createTestVariables(),
            },
            {
                id: 'remote',
                title: 'Remote HIGHROC OLCI L2C cube for region SNS',
                bbox: [4.0, 48.0, 12.0, 52.0],
                placeGroups: createTestPlaceGroups(),
                variables: createTestVariables(),
            },
            {
                id: 'computed',
                title: 'Computed HIGHROC OLCI weekly L3 cube for region SNS',
                bbox: [4.0, 48.0, 12.0, 52.0],
                placeGroups: createTestPlaceGroups(),
                variables: createTestVariables(),
            },
        ],
        userPlaces: createTestPlaceGroup('user', 'User')
    };
}


function createTestVariables(): Variable[] {
    return [
        {
            id: 'conc_chl',
            name: 'conc_chl',
            title: 'Chlorophyll Concentration',
            units: 'mg / m^-3',
            dims: ['time', 'lat', 'lon'],
            shape: [156, 2000, 2000],
            dtype: 'float64',
            tileSourceOptions: null,
        },
        {
            id: 'conc_tsm',
            name: 'conc_tsm',
            title: 'Total Suspended Matter',
            units: 'mg / m^-3',
            dims: ['time', 'lat', 'lon'],
            shape: [156, 2000, 2000],
            dtype: 'float64',
            tileSourceOptions: null,
        }
    ];
}

function createTestPlaceGroups(): PlaceGroup[] {
    return [
        {
            ...createTestPlaceGroup('lakes', 'Lakes'),
            placeGroups: {
                0: createTestPlaceGroup('lake-0', 'Lake 0'),
                1: createTestPlaceGroup('lake-1', 'Lake 1'),
                2: createTestPlaceGroup('lake-2', 'Lake 2'),
            },
        },
    ];
}

function createTestPlaceGroup(id: string, title: string): PlaceGroup {
    return {
        type: 'FeatureCollection',
        id,
        title,
        features: [
            createTestPlace(id + '-0'),
            createTestPlace(id + '-1'),
            createTestPlace(id + '-2'),
        ],
    };
}

function createTestPlace(id: string, title?: string): Place {

    const x0 = -180 + Math.random() * 360;
    const y0 = -80 + Math.random() * 160;
    const r = 1 + 9 * Math.random();
    const n = Math.floor(3 + 10 * Math.random());
    const coordinates = [];
    for (let i = 0; i < n; i++) {
        const a = 2 * Math.PI * i / n;
        coordinates.push([x0 + r * Math.cos(a), y0 + r * Math.sin(a)]);
    }
    coordinates.push(coordinates[0]);

    return {
        type: 'Feature',
        id,
        properties: {title: title || `Place ${id}`},
        geometry: {
            type: 'Polygon',
            coordinates: [coordinates],
        }
    };
}
