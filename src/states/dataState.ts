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
                locations: [],
                variables: [],
            },
            {
                id: "remote",
                title: "Remote HIGHROC OLCI L2C cube for region SNS",
                bounds: [4.0, 48.0, 12.0, 52.0],
                locations: [],
                variables: [],
            },
            {
                id: "computed",
                title: "Computed HIGHROC OLCI weekly L3 cube for region SNS",
                bounds: [4.0, 48.0, 12.0, 52.0],
                locations: [],
                variables: [],
            },
        ],
        userPlaces: {
            type: "FeatureCollection",
            features: [
                {
                    type: "Feature",
                    id: 0,
                    properties: {
                        title: "First Point"
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [11.0, 52.0],
                    }
                },
                {
                    type: "Feature",
                    id: 1,
                    properties: {
                        title: "Second Point"
                    },
                    geometry: {
                        type: "Point",
                        coordinates: [12.0, 51.0],
                    }
                }
            ]
        }
    };
}
