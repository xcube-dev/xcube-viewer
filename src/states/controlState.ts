export interface ComponentVisibility {
    sideMenu: boolean;
    datasetList: boolean;
    layerList: boolean;
    regionList: boolean;
    timePanel: boolean;
    timeSeriesPanel: boolean;
}

export interface ControlState {
    selectedDatasetId: string | null;
    selectedUserPlaceId: string | number | null;
    componentVisibility: ComponentVisibility;
}

export function newSessionState() {
    return {
        selectedDatasetId: null,
        selectedUserPlaceId: null,
        componentVisibility: {
            sideMenu: false,
            datasetList: false,
            layerList: false,
            regionList: false,
            timePanel: false,
            timeSeriesPanel: false,
        }
    };
}