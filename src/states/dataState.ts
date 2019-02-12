import * as GeoJSON from 'geojson';
import { Dataset, Variable } from "../types/dataset";
import { LocationGroup } from "../types/location";

export interface DataState {
    datasets: Dataset[];
    userPlaces: LocationGroup;
}

export function newDataState(): DataState {
    return {
        datasets: [
            {
                id: "local",
                title: "Local HIGHROC OLCI L2C cube for region SNS",
                bounds: [4.0, 48.0, 12.0, 52.0],
                locationGroup: createTestLocationGroup(),
                variables: createTestVariables(),
            },
            {
                id: "remote",
                title: "Remote HIGHROC OLCI L2C cube for region SNS",
                bounds: [4.0, 48.0, 12.0, 52.0],
                variables: createTestVariables(),
            },
            {
                id: "computed",
                title: "Computed HIGHROC OLCI weekly L3 cube for region SNS",
                bounds: [4.0, 48.0, 12.0, 52.0],
                variables: createTestVariables(),
            },
        ],
        userPlaces: {
            title: "Lakes",
            role: "lakes",
            locations: [
                {
                    feature: createTestFeature(11),
                },
                {
                    feature: createTestFeature(12),
                },
                {
                    feature: createTestFeature(13),
                },
            ],
        }
    };
}


function createTestVariables(): Variable[] {
    return [
        {
            id: "conc_chl",
            name: "conc_chl",
            title: "Chlorophyll Concentration",
            units: "mg / m^-3",
            dims: ["time", "lat", "lon"],
            shape: [156, 2000, 2000],
            dtype: "float64",
            tileSourceOptions: null,
        },
        {
            id: "conc_tsm",
            name: "conc_tsm",
            title: "Total Suspended Matter",
            units: "mg / m^-3",
            dims: ["time", "lat", "lon"],
            shape: [156, 2000, 2000],
            dtype: "float64",
            tileSourceOptions: null,
        }
    ];
}

function createTestLocationGroup(): LocationGroup {
    return {
        title: "Lakes",
        role: "lake",
        locations: [
            {
                feature: createTestFeature(0)
            },
            {
                feature: createTestFeature(1)
            },
            {
                feature: createTestFeature(2),
                group: {
                    title: "Lake Stations",
                    role: "station",
                    locations: [
                        {
                            feature: createTestFeature(3),
                        },
                        {
                            feature: createTestFeature(4),
                        },
                        {
                            feature: createTestFeature(5),
                        }
                    ]
                }
            }
        ]
    }
}

function createTestFeature(id: number, title?: string): GeoJSON.Feature {

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
        type: "Feature",
        id,
        properties: {title: title || `Feature #${id}`},
        geometry: {
            type: "Polygon",
            coordinates: [coordinates],
        }
    };
}


