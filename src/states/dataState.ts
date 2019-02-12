import * as GeoJSON from 'geojson';
import { Dataset } from "../types/dataset";
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
                locationGroup: {
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
                },
                variables: [
                    {
                        name: "conc_chl",
                        title: "Chlorophyll Concentration",
                    },
                    {
                        name: "conc_tsm",
                        title: "Total Suspended Matter",
                    }
                ],
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


function createTestVariables() {
    return [
        {
            name: "conc_chl",
            title: "Chlorophyll Concentration",
        },
        {
            name: "conc_tsm",
            title: "Total Suspended Matter",
        }
    ];
}

