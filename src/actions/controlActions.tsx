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

export const SELECT_LOCATION = 'SELECT_LOCATION';
export type SELECT_LOCATION = typeof SELECT_LOCATION;

export interface SelectLocation {
    type: SELECT_LOCATION;
    selectedLocationId: string | null;
}

export function selectLocation(selectedLocationId: string | null): SelectLocation {
    return {type: SELECT_LOCATION, selectedLocationId};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const SELECT_USER_PLACE = 'SELECT_USER_PLACE';
export type SELECT_USER_PLACE = typeof SELECT_USER_PLACE;

export interface SelectUserPlace {
    type: SELECT_USER_PLACE;
    selectedUserPlaceId: string | number | null;
}

export function selectUserPlace(selectedUserPlaceId: string | number | null): SelectUserPlace {
    return {type: SELECT_USER_PLACE, selectedUserPlaceId};
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const CHANGE_COMPONENT_VISIBILITY = 'CHANGE_COMPONENT_VISIBILITY';
export type CHANGE_COMPONENT_VISIBILITY = typeof CHANGE_COMPONENT_VISIBILITY;

export interface ChangeComponentVisibility {
    type: CHANGE_COMPONENT_VISIBILITY;
    propertyName: string;
    visibility?: boolean;
}

export function changeComponentVisibility(propertyName: string, visibility?: boolean): ChangeComponentVisibility {
    return {type: CHANGE_COMPONENT_VISIBILITY, propertyName, visibility};
}

export function closeDatasetList(): ChangeComponentVisibility {
    return changeComponentVisibility("datasetList", false);
}

export function closeLocationList(): ChangeComponentVisibility {
    return changeComponentVisibility("locationList", false);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export type ControlAction = SelectDataset | SelectLocation | SelectUserPlace | ChangeComponentVisibility;