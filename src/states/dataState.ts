import * as GeoJSON from 'geojson';
import { Dataset } from "../types/dataset";

export interface DataState {
    datasets: Dataset[];
    userPlaces: GeoJSON.FeatureCollection;
}

export function newDataState(): DataState {
    return {
        datasets: [],
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
