//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

import { MessageLogAction, postMessage } from "./messageLogActions";
import { AppState } from "../states/appState";
import { Dispatch } from "redux";
import * as api from '../api'
import { UpdateTimeSeries, updateTimeSeries } from "./dataActions";
import { TimeSeries } from "../types/timeSeries";
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
}

export function selectDataset(selectedDatasetId: string | null): SelectDataset {
    return {type: SELECT_DATASET, selectedDatasetId};
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

        if (selectedDatasetId && selectedVariable && selectedCoordinate) {
            api.getTimeSeriesForPoint(apiServerUrl, selectedDatasetId, selectedVariable, selectedCoordinate)
               .then((timeSeries: TimeSeries | null) => {
                   if (timeSeries !== null) {
                       dispatch(updateTimeSeries(timeSeries, "replace"));
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
    | SelectCoordinate;
