import { Dispatch } from "redux";

import {
    selectedDatasetIdSelector,
    selectedDatasetVariableSelector,
} from "../selectors/controlSelectors";
import { Dataset } from "../model/dataset";
import { Time, TimeRange, TimeSeries } from "../model/timeSeries";
import { AppState } from "../states/appState";
import * as api from '../api'
import { MessageLogAction, postMessage } from "./messageLogActions";
import { UpdateTimeSeries, updateTimeSeries } from "./dataActions";


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SELECT_DATASET = 'SELECT_DATASET';
export type SELECT_DATASET = typeof SELECT_DATASET;

export interface SelectDataset {
    type: SELECT_DATASET;
    selectedDatasetId: string | null;
    // TODO: Having datasets in here is ugly, but we need it in the reducer.
    // See
    // - https://medium.com/@williamjoshualacey/refactoring-redux-using-react-context-aa29fa16f4b7
    // - https://codeburst.io/the-ugly-side-of-redux-6591fde68200
    datasets: Dataset[];
}

export function selectDataset(selectedDatasetId: string | null, datasets: Dataset[]): SelectDataset {
    return {type: SELECT_DATASET, selectedDatasetId, datasets};
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SELECT_PLACE_GROUPS = 'SELECT_PLACE_GROUPS';
export type SELECT_PLACE_GROUPS = typeof SELECT_PLACE_GROUPS;

export interface SelectPlaceGroups {
    type: SELECT_PLACE_GROUPS;
    selectedPlaceGroupIds: string[] | null;
    // TODO: Having datasets in here is ugly, but we need it in the reducer.
    datasets: Dataset[];
}

export function selectPlaceGroups(selectedPlaceGroupIds: string[] | null, datasets: Dataset[]): SelectPlaceGroups {
    return {type: SELECT_PLACE_GROUPS, selectedPlaceGroupIds, datasets};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SELECT_PLACE = 'SELECT_PLACE';
export type SELECT_PLACE = typeof SELECT_PLACE;

export interface SelectPlace {
    type: SELECT_PLACE;
    selectedPlaceId: string | null;
    // TODO: Having datasets in here is ugly, but we need it in the reducer.
    datasets: Dataset[];
}

export function selectPlace(selectedPlaceId: string | null, datasets: Dataset[]): SelectPlace {
    return {type: SELECT_PLACE, selectedPlaceId, datasets};
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
    selectedTime: Time | null;
}

export function selectTime(selectedTime: Time | null): SelectTime {
    return {type: SELECT_TIME, selectedTime};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SELECT_TIME_RANGE = 'SELECT_TIME_RANGE';
export type SELECT_TIME_RANGE = typeof SELECT_TIME_RANGE;

export interface SelectTimeRange {
    type: SELECT_TIME_RANGE;
    selectedTimeRange: TimeRange | null;
}

export function selectTimeRange(selectedTimeRange: TimeRange | null): SelectTimeRange {
    return {type: SELECT_TIME_RANGE, selectedTimeRange};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const UPDATE_VISIBLE_TIME_RANGE = 'UPDATE_VISIBLE_TIME_RANGE';
export type UPDATE_VISIBLE_TIME_RANGE = typeof UPDATE_VISIBLE_TIME_RANGE;

export interface UpdateVisibleTimeRange {
    type: UPDATE_VISIBLE_TIME_RANGE;
    visibleTimeRange: TimeRange | null;
}

export function updateVisibleTimeRange(visibleTimeRange: TimeRange | null): UpdateVisibleTimeRange {
    return {type: UPDATE_VISIBLE_TIME_RANGE, visibleTimeRange};
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

export const UPDATE_TIME_ANIMATION = 'UPDATE_TIME_ANIMATION';
export type UPDATE_TIME_ANIMATION = typeof UPDATE_TIME_ANIMATION;

export interface UpdateTimeAnimation {
    type: UPDATE_TIME_ANIMATION;
    timeAnimationActive: boolean;
    timeAnimationInterval: number;
}

export function updateTimeAnimation(timeAnimationActive: boolean, timeAnimationInterval: number): UpdateTimeAnimation {
    return {type: UPDATE_TIME_ANIMATION, timeAnimationActive, timeAnimationInterval};
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
        let selectedVariable = selectedDatasetVariableSelector(getState());
        let timeSeriesUpdateMode = getState().controlState.timeSeriesUpdateMode;

        if (selectedDatasetId && selectedVariable && selectedCoordinate) {
            api.getTimeSeriesForPoint(apiServerUrl, selectedDatasetId, selectedVariable, selectedCoordinate)
               .then((timeSeries: TimeSeries | null) => {
                   if (timeSeries !== null) {
                       dispatch(updateTimeSeries(timeSeries, timeSeriesUpdateMode));
                   } else {
                       /*Database*/
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

export const ADD_ACTIVITY = 'ADD_ACTIVITY';
export type ADD_ACTIVITY = typeof ADD_ACTIVITY;

export interface AddActivity {
    type: ADD_ACTIVITY;
    id: string;
    message: string;
}

export function addActivity(id: string, message: string): AddActivity {
    return {type: ADD_ACTIVITY, id, message};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const REMOVE_ACTIVITY = 'REMOVE_ACTIVITY';
export type REMOVE_ACTIVITY = typeof REMOVE_ACTIVITY;

export interface RemoveActivity {
    type: REMOVE_ACTIVITY;
    id: string;
}

export function removeActivity(id: string): RemoveActivity {
    return {type: REMOVE_ACTIVITY, id};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const CHANGE_LOCALE = 'CHANGE_LOCALE';
export type CHANGE_LOCALE = typeof CHANGE_LOCALE;

export interface ChangeLocale {
    type: CHANGE_LOCALE;
    locale: string;
}

export function changeLocale(locale: string): ChangeLocale {
    return {type: CHANGE_LOCALE, locale};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const OPEN_DIALOG = 'OPEN_DIALOG';
export type OPEN_DIALOG = typeof OPEN_DIALOG;

export interface OpenDialog {
    type: OPEN_DIALOG;
    dialogId: string;
}

export function openDialog(dialogId: string): OpenDialog {
    return {type: OPEN_DIALOG, dialogId};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const CLOSE_DIALOG = 'CLOSE_DIALOG';
export type CLOSE_DIALOG = typeof CLOSE_DIALOG;

export interface CloseDialog {
    type: CLOSE_DIALOG;
    dialogId: string;
}

export function closeDialog(dialogId: string): CloseDialog {
    return {type: CLOSE_DIALOG, dialogId};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type ControlAction =
    SelectDataset
    | SelectVariable
    | SelectPlaceGroups
    | SelectPlace
    | SelectUserPlace
    | SelectTime
    | SelectTimeRange
    | SelectCoordinate
    | SelectTimeSeriesUpdateMode
    | UpdateVisibleTimeRange
    | UpdateTimeAnimation
    | AddActivity
    | RemoveActivity
    | ChangeLocale
    | OpenDialog
    | CloseDialog;
