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
    selectedVariableId: string | null;
    selectedPlaceId: string | number | null;
    selectedDateTime: string | null;

    selectedUserPlaceId: string | number | null;
}

export function newControlState() {
    return {
        selectedDatasetId: "local",
        selectedVariableId: "conc_chl",
        selectedPlaceId: 0,
        selectedUserPlaceId: null,
        selectedDateTime: null,
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