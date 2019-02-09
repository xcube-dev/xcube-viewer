import { Dataset } from "../types/dataset";

export interface DataState {
    datasets: Dataset[];
}

export function newDataState() {
    return {
        datasets: [],
    };
}