export interface ControlState {
    selectedDatasetId: string | null;
    selectedVariableName: string | null;
    selectedPlaceId: string | null;
    selectedUserPlaceId: string | null;
    selectedTime: string | null;
    selectedCoordinate: [number, number] | null;
    selectedDrawMode: ol.geom.GeometryType | null;
    timeSeriesUpdateMode: "add" | "replace";
    map: ol.Map | null;
}

export function newControlState(): ControlState {
    return {
        selectedDatasetId: "local",
        selectedVariableName: "conc_chl",
        selectedPlaceId: null,
        selectedUserPlaceId: null,
        selectedTime: null,
        selectedCoordinate: null,
        selectedDrawMode: "Point",
        timeSeriesUpdateMode: "replace",
        map: null,
    };
}