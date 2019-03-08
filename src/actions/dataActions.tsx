import { Dispatch } from 'redux';
import { AppState } from '../states/appState';
import * as api from '../api'
import { MessageLogAction, postMessage } from './messageLogActions';
import {
    AddActivity,
    addActivity,
    RemoveActivity,
    removeActivity,
    SelectDataset,
    selectDataset
} from './controlActions';
import { Dataset } from '../model/dataset';
import { TimeSeries } from '../model/timeSeries';
import { ColorBars } from '../model/colorBar';
import { I18N } from '../config';


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const UPDATE_DATASETS = 'UPDATE_DATASETS';
export type UPDATE_DATASETS = typeof UPDATE_DATASETS;

export interface UpdateDatasets {
    type: UPDATE_DATASETS;
    datasets: Dataset[];
}

export function updateDatasets() {
    return (dispatch: Dispatch<UpdateDatasets | SelectDataset | AddActivity | RemoveActivity | MessageLogAction>, getState: () => AppState) => {
        const state = getState();
        const apiServerUrl = state.configState.apiServerUrl;

        dispatch(addActivity(UPDATE_DATASETS, I18N.get("Loading data")));

        api.getDatasets(apiServerUrl)
           .then((datasets: Dataset[]) => {
               dispatch(_updateDatasets(datasets));
               if (datasets.length > 0) {
                   dispatch(selectDataset(datasets[0].id, datasets));
               }
           })
           .catch(error => {
               dispatch(postMessage('error', error + ''));
           })
           .finally(() => {
               dispatch(removeActivity(UPDATE_DATASETS));
           });
    };
}

export function _updateDatasets(datasets: Dataset[]): UpdateDatasets {
    return {type: UPDATE_DATASETS, datasets};
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const UPDATE_COLOR_BARS = 'UPDATE_COLOR_BARS';
export type UPDATE_COLOR_BARS = typeof UPDATE_COLOR_BARS;

export interface UpdateColorBars {
    type: UPDATE_COLOR_BARS;
    colorBars: ColorBars;
}

export function updateColorBars() {
    return (dispatch: Dispatch<UpdateColorBars | MessageLogAction>, getState: () => AppState) => {
        const state = getState();
        const apiServerUrl = state.configState.apiServerUrl;

        api.getColorBars(apiServerUrl)
           .then((colorBars: ColorBars) => {
               dispatch(_updateColorBars(colorBars));
           })
           .catch(error => {
               dispatch(postMessage('error', error.message || `${error}`));
           });
    };
}

export function _updateColorBars(colorBars: ColorBars): UpdateColorBars {
    return {type: UPDATE_COLOR_BARS, colorBars};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const UPDATE_TIME_SERIES = 'UPDATE_TIME_SERIES';
export type UPDATE_TIME_SERIES = typeof UPDATE_TIME_SERIES;

export interface UpdateTimeSeries {
    type: UPDATE_TIME_SERIES;
    timeSeries: TimeSeries;
    updateMode: 'add' | 'replace';
}

export function updateTimeSeries(timeSeries: TimeSeries, updateMode: 'add' | 'replace'): UpdateTimeSeries {
    return {type: UPDATE_TIME_SERIES, timeSeries, updateMode};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const REMOVE_ALL_TIME_SERIES = 'REMOVE_ALL_TIME_SERIES';
export type REMOVE_ALL_TIME_SERIES = typeof REMOVE_ALL_TIME_SERIES;

export interface RemoveAllTimeSeries {
    type: REMOVE_ALL_TIME_SERIES;
}

export function removeAllTimeSeries(): RemoveAllTimeSeries {
    return {type: REMOVE_ALL_TIME_SERIES};
}

////////////////////////////////////////////////////////////////////////////////////////////////


export type DataAction = UpdateDatasets | UpdateColorBars | UpdateTimeSeries | RemoveAllTimeSeries;
