export interface ComponentVisibility {
    sideMenu: boolean;
    datasetList: boolean;
    layerList: boolean;
    locationList: boolean;
    timePanel: boolean;
    timeSeriesPanel: boolean;
}

export interface ControlState {
    selectedDatasetId: string | null;
    selectedLocationId: string | number | null;
    selectedUserPlaceId: string | number | null;
    componentVisibility: ComponentVisibility;
}

export function newSessionState() {
    return {
        selectedDatasetId: null,
        selectedLocationId: null,
        selectedUserPlaceId: null,
        componentVisibility: {
            sideMenu: false,
            datasetList: false,
            layerList: false,
            locationList: false,
            timePanel: false,
            timeSeriesPanel: false,
        }
    };
}