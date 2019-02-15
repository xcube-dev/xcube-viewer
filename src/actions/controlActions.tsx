//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { MessageLogAction, postMessage } from "./messageLogActions";
import { AppState } from "../states/appState";
import { Dispatch } from "redux";
import * as api from '../api'
import { UpdateTimeSeries, updateTimeSeries } from "./dataActions";
import { TimeSeries, Dataset } from "../model";
import {
    selectedDatasetIdSelector,
    selectedVariableSelector,
} from "../selectors/controlSelectors";

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SELECT_DATASET = 'SELECT_DATASET';
export type SELECT_DATASET = typeof SELECT_DATASET;

export interface SelectDataset {
    type: SELECT_DATASET;
    selectedDatasetId: string | null;
    // Now, having datasets is really ugly, but we need it in the reducer to set selectedVariableName!
    // That's why I started reading
    // - https://medium.com/@williamjoshualacey/refactoring-redux-using-react-context-aa29fa16f4b7
    // - https://codeburst.io/the-ugly-side-of-redux-6591fde68200
    datasets: Dataset[];
}

export function selectDataset(selectedDatasetId: string | null, datasets: Dataset[]): SelectDataset {
    return {type: SELECT_DATASET, selectedDatasetId, datasets};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SELECT_VARIABLE = 'SELECT_VARIABLE';
export type SELECT_VARIABLE = typeof SELECT_VARIABLE;

export interface SelectVariable {
    type: SELECT_VARIABLE;
    selectedVariableName: string | null;
}

export function selectVariable(selectedVariableName: string | null): SelectVariable {
    return {type: SELECT_VARIABLE, selectedVariableName};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SELECT_PLACE = 'SELECT_PLACE';
export type SELECT_PLACE = typeof SELECT_PLACE;

export interface SelectPlace {
    type: SELECT_PLACE;
    selectedPlaceId: string | null;
}

export function selectPlace(selectedPlaceId: string | null): SelectPlace {
    return {type: SELECT_PLACE, selectedPlaceId};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SELECT_USER_PLACE = 'SELECT_USER_PLACE';
export type SELECT_USER_PLACE = typeof SELECT_USER_PLACE;

export interface SelectUserPlace {
    type: SELECT_USER_PLACE;
    selectedUserPlaceId: string | null;
}

export function selectUserPlace(selectedUserPlaceId: string | null): SelectUserPlace {
    return {type: SELECT_USER_PLACE, selectedUserPlaceId};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SELECT_TIME = 'SELECT_TIME';
export type SELECT_TIME = typeof SELECT_TIME;

export interface SelectTime {
    type: SELECT_TIME;
    selectedTime: string | null;
}

export function selectTime(selectedTime: string | null): SelectTime {
    return {type: SELECT_TIME, selectedTime};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SELECT_TIME_SERIES_UPDATE_MODE = 'SELECT_TIME_SERIES_UPDATE_MODE';
export type SELECT_TIME_SERIES_UPDATE_MODE = typeof SELECT_TIME_SERIES_UPDATE_MODE;

export interface SelectTimeSeriesUpdateMode {
    type: SELECT_TIME_SERIES_UPDATE_MODE;
    timeSeriesUpdateMode: "add" | "replace";
}

export function selectTimeSeriesUpdateMode(timeSeriesUpdateMode: "add" | "replace"): SelectTimeSeriesUpdateMode {
    return {type: SELECT_TIME_SERIES_UPDATE_MODE, timeSeriesUpdateMode};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const STORE_MAP_REF = 'STORE_MAP_REF';
export type STORE_MAP_REF = typeof STORE_MAP_REF;

export interface StoreMapRef {
    type: STORE_MAP_REF;
    map: ol.Map;
}

export function storeMapRef(map: ol.Map): StoreMapRef {
    return {type: STORE_MAP_REF, map};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SELECT_COORDINATE = 'SELECT_COORDINATE';
export type SELECT_COORDINATE = typeof SELECT_COORDINATE;

export interface SelectCoordinate {
    type: SELECT_COORDINATE;
    selectedCoordinate: [number, number] | null;
}

export function selectCoordinate(selectedCoordinate: [number, number] | null) {
    return (dispatch: Dispatch<SelectCoordinate | UpdateTimeSeries | MessageLogAction>, getState: () => AppState) => {
        const apiServerUrl = getState().configState.apiServerUrl;

        dispatch(_selectCoordinate(selectedCoordinate));

        let selectedDatasetId = selectedDatasetIdSelector(getState());
        let selectedVariable = selectedVariableSelector(getState());
        let timeSeriesUpdateMode = getState().controlState.timeSeriesUpdateMode;

        if (selectedDatasetId && selectedVariable && selectedCoordinate) {
            api.getTimeSeriesForPoint(apiServerUrl, selectedDatasetId, selectedVariable, selectedCoordinate)
               .then((timeSeries: TimeSeries | null) => {
                   if (timeSeries !== null) {
                       dispatch(updateTimeSeries(timeSeries, timeSeriesUpdateMode));
                   } else {
                       /*I18N*/
                       dispatch(postMessage('info', 'No data found here'));
                   }
               })
               .catch(error => {
                   dispatch(postMessage('error', error + ''));
               });
        }
    };
}

export function _selectCoordinate(selectedCoordinate: [number, number] | null): SelectCoordinate {
    return {type: SELECT_COORDINATE, selectedCoordinate};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type ControlAction =
    SelectDataset
    | SelectVariable
    | SelectPlace
    | SelectUserPlace
    | SelectTime
    | SelectCoordinate
    | SelectTimeSeriesUpdateMode
    | StoreMapRef;
