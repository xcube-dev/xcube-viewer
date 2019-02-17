import * as ol from "openlayers";


export interface ControlState {
    selectedDatasetId: string | null;
    selectedVariableName: string | null;
    selectedPlaceId: string | null;
    selectedUserPlaceId: string | null;
    selectedTime: string | null;
    selectedTimeRange: [number, number] | null;
    selectedCoordinate: [number, number] | null;
    selectedDrawMode: ol.geom.GeometryType | null;
    timeSeriesUpdateMode: "add" | "replace";
    flyTo: ol.geom.SimpleGeometry | ol.Extent | null;
}

export function newControlState(): ControlState {
    return {
        selectedDatasetId: "local",
        selectedVariableName: "conc_chl",
        selectedPlaceId: null,
        selectedUserPlaceId: null,
        selectedTime: null,
        selectedTimeRange: null,
        selectedCoordinate: null,
        selectedDrawMode: "Point",
        timeSeriesUpdateMode: "replace",
        flyTo: null,
    };
}