import * as ol from 'openlayers';

import { ControlState, newControlState } from '../states/controlState';
import {
    SELECT_DATASET,
    SELECT_VARIABLE,
    SELECT_PLACE,
    SELECT_TIME,
    SELECT_TIME_SERIES_UPDATE_MODE,
    SELECT_USER_PLACE,
    SELECT_COORDINATE,
    ControlAction, STORE_MAP_REF,
} from '../actions/controlActions';
import { findDataset, findDatasetVariable } from '../model';


export function controlReducer(state: ControlState, action: ControlAction): ControlState {
    if (typeof state === 'undefined') {
        state = newControlState();
    }
    switch (action.type) {
        case SELECT_DATASET: {
            let selectedVariableName = state.selectedVariableName;
            const dataset = findDataset(action.datasets, action.selectedDatasetId)!;
            const variable = findDatasetVariable(dataset, selectedVariableName);
            if (!variable && dataset.variables.length > 0) {
                selectedVariableName = dataset.variables[0].name;
            }
            if (dataset.bbox && state.map !== null) {
                const map = state.map!;
                map.getView().fit(ol.proj.transformExtent(dataset.bbox as ol.Extent,
                                                          'EPSG:4326',
                                                          map.getView().getProjection()),
                                  {size: map.getSize()});
            }
            return {
                ...state,
                selectedDatasetId: action.selectedDatasetId,
                selectedVariableName
            };
        }
        case SELECT_VARIABLE: {
            return {
                ...state,
                selectedVariableName: action.selectedVariableName,
            };
        }
        case SELECT_PLACE: {
            return {
                ...state,
                selectedPlaceId: action.selectedPlaceId,
            };
        }
        case SELECT_USER_PLACE: {
            return {
                ...state,
                selectedUserPlaceId: action.selectedUserPlaceId,
            };
        }
        case SELECT_TIME: {
            return {
                ...state,
                selectedTime: action.selectedTime,
            };
        }
        case SELECT_TIME_SERIES_UPDATE_MODE: {
            return {
                ...state,
                timeSeriesUpdateMode: action.timeSeriesUpdateMode,
            };
        }
        case SELECT_COORDINATE: {
            return {
                ...state,
                selectedCoordinate: action.selectedCoordinate,
            };
        }
        case STORE_MAP_REF: {
            return {
                ...state,
                map: action.map,
            };
        }
    }
    return state;
}

