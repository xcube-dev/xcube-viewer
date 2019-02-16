import { Dispatch } from 'redux';
import { MessageLogAction, postMessage } from './messageLogActions';
import { AppState } from '../states/appState';
import { Dataset, TimeSeries } from '../model';
import * as api from '../api'
import { SelectDataset, selectDataset } from "./controlActions";


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const UPDATE_DATASETS = 'UPDATE_DATASETS';
export type UPDATE_DATASETS = typeof UPDATE_DATASETS;

export interface UpdateDatasets {
    type: UPDATE_DATASETS;
    datasets: Dataset[];
}

export function updateDatasets() {
    return (dispatch: Dispatch<UpdateDatasets | SelectDataset| MessageLogAction>, getState: () => AppState) => {
        const state = getState();
        const apiServerUrl = state.configState.apiServerUrl;

        api.getDatasets(apiServerUrl)
           .then((datasets: Dataset[]) => {
               dispatch(_updateDatasets(datasets));
               if (datasets.length > 0) {
                   dispatch(selectDataset(datasets[0].id, datasets));
               }
           })
           .catch(error => {
               dispatch(postMessage('error', error + ''));
           });
    };
}

export function _updateDatasets(datasets: Dataset[]): UpdateDatasets {
    return {type: UPDATE_DATASETS, datasets};
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const UPDATE_TIME_SERIES = 'UPDATE_TIME_SERIES';
export type UPDATE_TIME_SERIES = typeof UPDATE_TIME_SERIES;

export interface UpdateTimeSeries {
    type: UPDATE_TIME_SERIES;
    timeSeries: TimeSeries;
    updateMode: "add" | "replace";
}

export function updateTimeSeries(timeSeries: TimeSeries, updateMode: "add" | "replace"): UpdateTimeSeries {
    return {type: UPDATE_TIME_SERIES, timeSeries, updateMode};
}

////////////////////////////////////////////////////////////////////////////////////////////////


export type DataAction = UpdateDatasets | UpdateTimeSeries;