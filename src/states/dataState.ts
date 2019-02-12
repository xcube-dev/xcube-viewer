import * as GeoJSON from 'geojson';
import { Dataset } from "../types/dataset";

export interface DataState {
    datasets: Dataset[];
    userPlaces: GeoJSON.FeatureCollection;
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
                                title: "Lakes",
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
                variables: [],
            },
            {
                id: "remote",
                title: "Remote HIGHROC OLCI L2C cube for region SNS",
                bounds: [4.0, 48.0, 12.0, 52.0],
                variables: [],
            },
            {
                id: "computed",
                title: "Computed HIGHROC OLCI weekly L3 cube for region SNS",
                bounds: [4.0, 48.0, 12.0, 52.0],
                variables: [],
            },
        ],
        userPlaces: {
            type: "FeatureCollection",
            features: [
                createTestFeature(10),
                createTestFeature(11),
                createTestFeature(12),
                createTestFeature(13),
            ]
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
