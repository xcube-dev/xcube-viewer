import { Dispatch } from 'redux';
import { MessageLogAction, postMessage } from './messageLogActions';
import { AppState } from '../states/appState';
import * as api from '../api'
import { Dataset } from '../types/dataset';

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export const UPDATE_DATASETS = 'UPDATE_DATASETS';
export type UPDATE_DATASETS = typeof UPDATE_DATASETS;

export interface UpdateDatasets {
    type: UPDATE_DATASETS;
    datasets: Dataset[];
}


export function updateDatasets() {
    return (dispatch: Dispatch<UpdateDatasets | MessageLogAction>, getState: () => AppState) => {
        const state = getState();
        const apiServerUrl = state.configState.apiServerUrl;

        api.getDatasets(apiServerUrl)
           .then((datasets: Dataset[]) => {
               dispatch(_updateDatasets(datasets));
           })
           .catch(error => {
               dispatch(postMessage('error', error + ''));
           });
    };
}


export function _updateDatasets(datasets: Dataset[]): UpdateDatasets {
    return {type: UPDATE_DATASETS, datasets};
}

////////////////////////////////////////////////////////////////////////////////////////////////


export type DataAction = UpdateDatasets;