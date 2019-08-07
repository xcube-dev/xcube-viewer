import { Dispatch } from 'redux';

import { AppState } from '../states/appState';
import * as api from '../api'
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
import { selectedServerSelector } from "../selectors/controlSelectors";
import { Server } from "../model/server";
import { MessageLogAction, postMessage } from './messageLogActions';


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const UPDATE_DATASETS = 'UPDATE_DATASETS';
export type UPDATE_DATASETS = typeof UPDATE_DATASETS;

export interface UpdateDatasets {
    type: UPDATE_DATASETS;
    datasets: Dataset[];
}

export function updateDatasets() {
    return (dispatch: Dispatch<UpdateDatasets | SelectDataset | AddActivity | RemoveActivity | MessageLogAction>, getState: () => AppState) => {
        const apiServer = selectedServerSelector(getState());

        dispatch(addActivity(UPDATE_DATASETS, I18N.get("Loading data")));

        api.getDatasets(apiServer.url)
           .then((datasets: Dataset[]) => {
               dispatch(_updateDatasets(datasets));
               if (datasets.length > 0) {
                   dispatch(selectDataset(datasets[0].id, datasets));
               }
           })
           .catch(error => {
               dispatch(postMessage('error', error + ''));
           })
           // 'then' because Microsoft Edge does not understand method finally
           .then(() => {
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
        const apiServer = selectedServerSelector(getState());

        api.getColorBars(apiServer.url)
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
    dataMode: 'new' | 'append';
}

export function updateTimeSeries(timeSeries: TimeSeries, updateMode: 'add' | 'replace', dataMode: 'new' | 'append'): UpdateTimeSeries {
    return {type: UPDATE_TIME_SERIES, timeSeries, updateMode, dataMode};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const REMOVE_TIME_SERIES_GROUP = 'REMOVE_TIME_SERIES_GROUP';
export type REMOVE_TIME_SERIES_GROUP = typeof REMOVE_TIME_SERIES_GROUP;

export interface RemoveTimeSeriesGroup {
    type: REMOVE_TIME_SERIES_GROUP;
    id: string;
}

export function removeTimeSeriesGroup(id: string): RemoveTimeSeriesGroup {
    return {type: REMOVE_TIME_SERIES_GROUP, id};
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


export const CONFIGURE_SERVERS = 'CONFIGURE_SERVERS';
export type CONFIGURE_SERVERS = typeof CONFIGURE_SERVERS;

export interface ConfigureServers {
    type: CONFIGURE_SERVERS;
    servers: Server[];
    selectedServerId: string;
}

export function configureServers(servers: Server[], selectedServerId: string) {
    return (dispatch: Dispatch<any>, getState: () => AppState) => {
        if (getState().controlState.selectedServerId !== selectedServerId) {
            dispatch(removeAllTimeSeries());
            dispatch(_configureServers(servers, selectedServerId));
            dispatch(updateDatasets());
            dispatch(updateColorBars());
        } else if (getState().dataState.userServers !== servers) {
            dispatch(_configureServers(servers, selectedServerId));
        }
    };
}

export function _configureServers(servers: Server[], selectedServerId: string): ConfigureServers {
    return {type: CONFIGURE_SERVERS, servers, selectedServerId};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type DataAction =
    UpdateDatasets
    | UpdateColorBars
    | UpdateTimeSeries
    | RemoveTimeSeriesGroup
    | RemoveAllTimeSeries
    | ConfigureServers;
