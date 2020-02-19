import { Extent as OlExtent } from 'ol/extent';
import { default as OlGeoJSONFormat } from 'ol/format/GeoJSON';
import { Geometry as OlGeometry } from 'ol/geom';
import { Dispatch } from 'redux';

import {
    selectedDatasetIdSelector,
    selectedDatasetSelectedPlaceGroupsSelector,
    selectedDatasetSelector, selectedPlaceGroupsSelector, selectedPlaceIdSelector,
    selectedServerSelector,
} from '../selectors/controlSelectors';
import { Dataset, findDataset } from '../model/dataset';
import { Time, TimeRange } from '../model/timeSeries';
import { datasetsSelector } from '../selectors/dataSelectors';
import { AppState } from '../states/appState';
import * as api from '../api'
import { MessageLogAction, postMessage } from './messageLogActions';
import {
    updateDatasetPlaceGroup, UPDATE_DATASET_PLACE_GROUP,
    UpdateDatasetPlaceGroup,
} from './dataActions';
import { findPlaceInPlaceGroups, isValidPlaceGroup, Place, PlaceGroup } from '../model/place';
import { I18N } from '../config';
import { ControlState, MapInteraction, TimeAnimationInterval } from '../states/controlState';

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

export function selectDataset(selectedDatasetId: string | null, datasets: Dataset[], showInMap: boolean) {
    return (dispatch: Dispatch<SelectDataset>) => {
        dispatch(_selectDataset(selectedDatasetId, datasets));
        if (selectedDatasetId && showInMap) {
            dispatch(flyToDataset(selectedDatasetId) as any);
        }
    }
}

export function _selectDataset(selectedDatasetId: string | null, datasets: Dataset[]): SelectDataset {
    return {type: SELECT_DATASET, selectedDatasetId, datasets};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function flyToDataset(selectedDatasetId: string) {
    return (dispatch: Dispatch<FlyTo>, getState: () => AppState) => {
        const datasets = datasetsSelector(getState());
        const dataset = findDataset(datasets, selectedDatasetId);
        if (dataset && dataset.bbox) {
            dispatch(flyTo(dataset.bbox));
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const SIMPLE_GEOMETRY_TYPES = ['Point', 'LineString', 'LinearRing', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon', 'Circle'];

export function flyToPlace(selectedPlaceId: string) {
    return (dispatch: Dispatch<FlyTo>, getState: () => AppState) => {
        const placeGroups = selectedPlaceGroupsSelector(getState());
        const place = findPlaceInPlaceGroups(placeGroups, selectedPlaceId);
        if (place) {
            if (place.bbox) {
                dispatch(flyTo(place.bbox));
            } else if (place.geometry && SIMPLE_GEOMETRY_TYPES.includes(place.geometry.type)) {
                dispatch(flyTo(new OlGeoJSONFormat().readGeometry(place.geometry)));
            }
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function flyToSelectedObject() {
    return (dispatch: Dispatch, getState: () => AppState) => {
        const placeId = selectedPlaceIdSelector(getState());
        const datasetId = selectedDatasetIdSelector(getState());
        if (placeId) {
            dispatch(flyToPlace(placeId) as any);
        } else if (datasetId) {
            dispatch(flyToDataset(datasetId) as any);
        }
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const FLY_TO = 'FLY_TO';
export type FLY_TO = typeof FLY_TO;

export interface FlyTo {
    type: FLY_TO;
    mapId: string;
    location: OlGeometry | OlExtent | null;
}

export function flyTo(location: OlGeometry | OlExtent | null): FlyTo {
    return {type: FLY_TO, mapId: 'map', location};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SELECT_PLACE_GROUPS = 'SELECT_PLACE_GROUPS';
export type SELECT_PLACE_GROUPS = typeof SELECT_PLACE_GROUPS;

export interface SelectPlaceGroups {
    type: SELECT_PLACE_GROUPS;
    selectedPlaceGroupIds: string[] | null;
}

export function selectPlaceGroups(selectedPlaceGroupIds: string[] | null) {

    return (dispatch: Dispatch<SelectPlaceGroups | UpdateDatasetPlaceGroup | AddActivity | RemoveActivity | MessageLogAction>, getState: () => AppState) => {
        const apiServer = selectedServerSelector(getState());

        dispatch(_selectPlaceGroups(selectedPlaceGroupIds));

        const dataset = selectedDatasetSelector(getState());
        const placeGroups = selectedDatasetSelectedPlaceGroupsSelector(getState());
        if (dataset !== null && placeGroups.length > 0) {
            for (let placeGroup of placeGroups) {
                if (!isValidPlaceGroup(placeGroup)) {
                    const datasetId = dataset!.id;
                    const placeGroupId = placeGroup.id;
                    const activitityId = `${UPDATE_DATASET_PLACE_GROUP}-${datasetId}-${placeGroupId}`;
                    dispatch(addActivity(activitityId, I18N.get('Loading places')));
                    api.getDatasetPlaceGroup(apiServer.url,
                                             datasetId,
                                             placeGroupId,
                                             getState().userAuthState.accessToken)
                       .then((placeGroup: PlaceGroup) => {
                           dispatch(updateDatasetPlaceGroup(dataset!.id, placeGroup));
                       })
                       .catch(error => {
                           dispatch(postMessage('error', error));
                       })
                       .finally(() => {
                           dispatch(removeActivity(activitityId));
                       });
                }
            }
        }
    };
}

export function _selectPlaceGroups(selectedPlaceGroupIds: string[] | null): SelectPlaceGroups {
    return {type: SELECT_PLACE_GROUPS, selectedPlaceGroupIds};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SELECT_PLACE = 'SELECT_PLACE';
export type SELECT_PLACE = typeof SELECT_PLACE;

export interface SelectPlace {
    type: SELECT_PLACE;
    selectedPlaceId: string | null;
    // TODO: Having places in here is ugly, but we need it in the reducer.
    places: Place[];
}


export function selectPlace(selectedPlaceId: string | null, places: Place[], showInMap: boolean) {
    return (dispatch: Dispatch<SelectPlace>) => {
        dispatch(_selectPlace(selectedPlaceId, places));
        if (showInMap && selectedPlaceId) {
            dispatch(flyToPlace(selectedPlaceId) as any);
        }
    }
}

function _selectPlace(selectedPlaceId: string | null, places: Place[]): SelectPlace {
    return {type: SELECT_PLACE, selectedPlaceId, places};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SET_RGB_LAYER_VISIBILITY = 'SET_RGB_LAYER_VISIBILITY';
export type SET_RGB_LAYER_VISIBILITY = typeof SET_RGB_LAYER_VISIBILITY;

export interface SetRgbLayerVisibility {
    type: SET_RGB_LAYER_VISIBILITY;
    showRgbLayer: boolean;
}

export function setRgbLayerVisibility(showRgbLayer: boolean): SetRgbLayerVisibility {
    return {type: SET_RGB_LAYER_VISIBILITY, showRgbLayer};
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

export const INC_SELECTED_TIME = 'INC_SELECTED_TIME';
export type INC_SELECTED_TIME = typeof INC_SELECTED_TIME;

export interface IncSelectedTime {
    type: INC_SELECTED_TIME;
    increment: -1 | 1;
}

export function incSelectedTime(increment: -1 | 1): IncSelectedTime {
    return {type: INC_SELECTED_TIME, increment};
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

// TODO (forman): this action doesn't seem to be in use - remove!

export const SELECT_TIME_SERIES_UPDATE_MODE = 'SELECT_TIME_SERIES_UPDATE_MODE';
export type SELECT_TIME_SERIES_UPDATE_MODE = typeof SELECT_TIME_SERIES_UPDATE_MODE;

export interface SelectTimeSeriesUpdateMode {
    type: SELECT_TIME_SERIES_UPDATE_MODE;
    timeSeriesUpdateMode: 'add' | 'replace';
}

export function selectTimeSeriesUpdateMode(timeSeriesUpdateMode: 'add' | 'replace'): SelectTimeSeriesUpdateMode {
    return {type: SELECT_TIME_SERIES_UPDATE_MODE, timeSeriesUpdateMode};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const UPDATE_TIME_ANIMATION = 'UPDATE_TIME_ANIMATION';
export type UPDATE_TIME_ANIMATION = typeof UPDATE_TIME_ANIMATION;

export interface UpdateTimeAnimation {
    type: UPDATE_TIME_ANIMATION;
    timeAnimationActive: boolean;
    timeAnimationInterval: TimeAnimationInterval;
}

export function updateTimeAnimation(timeAnimationActive: boolean, timeAnimationInterval: TimeAnimationInterval): UpdateTimeAnimation {
    return {type: UPDATE_TIME_ANIMATION, timeAnimationActive, timeAnimationInterval};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SET_MAP_INTERACTION = 'SET_MAP_INTERACTION';
export type SET_MAP_INTERACTION = typeof SET_MAP_INTERACTION;

export interface SetMapInteraction {
    type: SET_MAP_INTERACTION;
    mapInteraction: MapInteraction;
}

export function setMapInteraction(mapInteraction: MapInteraction): SetMapInteraction {
    return {type: SET_MAP_INTERACTION, mapInteraction};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SHOW_INFO_CARD = 'SHOW_INFO_CARD';
export type SHOW_INFO_CARD = typeof SHOW_INFO_CARD;

export interface ShowInfoCard {
    type: SHOW_INFO_CARD;
    infoCardOpen: boolean;
}

export function showInfoCard(infoCardOpen: boolean): ShowInfoCard {
    return {type: SHOW_INFO_CARD, infoCardOpen};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SET_VISIBLE_INFO_CARD_ELEMENTS = 'SET_VISIBLE_INFO_CARD_ELEMENTS';
export type SET_VISIBLE_INFO_CARD_ELEMENTS = typeof SET_VISIBLE_INFO_CARD_ELEMENTS;

export interface SetVisibleInfoCardElements {
    type: SET_VISIBLE_INFO_CARD_ELEMENTS;
    visibleElements: string[];
}

export function setVisibleInfoCardElements(visibleElements: string[]): SetVisibleInfoCardElements {
    return {type: SET_VISIBLE_INFO_CARD_ELEMENTS, visibleElements};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const UPDATE_INFO_CARD_ELEMENT_VIEW_MODE = 'UPDATE_INFO_CARD_ELEMENT_VIEW_MODE';
export type UPDATE_INFO_CARD_ELEMENT_VIEW_MODE = typeof UPDATE_INFO_CARD_ELEMENT_VIEW_MODE;

export interface UpdateInfoCardElementCodeMode {
    type: UPDATE_INFO_CARD_ELEMENT_VIEW_MODE;
    elementType: string;
    viewMode: string;
}

export function updateInfoCardElementViewMode(elementType: string, viewMode: string): UpdateInfoCardElementCodeMode {
    return {type: UPDATE_INFO_CARD_ELEMENT_VIEW_MODE, elementType, viewMode};
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

export const UPDATE_SETTINGS = 'UPDATE_SETTINGS';
export type UPDATE_SETTINGS = typeof UPDATE_SETTINGS;

export interface UpdateSettings {
    type: UPDATE_SETTINGS;
    settings: ControlState;
}

export function updateSettings(settings: ControlState): UpdateSettings {
    return {type: UPDATE_SETTINGS, settings};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export type ControlAction =
    SelectDataset
    | UpdateDatasetPlaceGroup
    | SelectVariable
    | SelectPlaceGroups
    | SelectPlace
    | SelectTime
    | SetRgbLayerVisibility
    | IncSelectedTime
    | SelectTimeRange
    | SelectTimeSeriesUpdateMode
    | UpdateTimeAnimation
    | SetMapInteraction
    | AddActivity
    | RemoveActivity
    | ChangeLocale
    | UpdateSettings
    | OpenDialog
    | CloseDialog
    | ShowInfoCard
    | SetVisibleInfoCardElements
    | UpdateInfoCardElementCodeMode
    | FlyTo;
