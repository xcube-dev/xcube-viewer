import * as ol from "openlayers";
import { Time, TimeRange } from "../model/timeSeries";


export interface ControlState {
    selectedDatasetId: string | null;
    selectedVariableName: string | null;
    selectedPlaceGroupIds: string[] | null;
    selectedPlaceId: string | null;
    selectedUserPlaceId: string | null;
    selectedTime: Time | null;
    selectedTimeRange: TimeRange | null;
    visibleTimeRange: TimeRange | null;
    selectedCoordinate: [number, number] | null;
    selectedDrawMode: ol.geom.GeometryType | null;
    timeSeriesUpdateMode: "add" | "replace";
    flyTo: ol.geom.SimpleGeometry | ol.Extent | null;
}

export function newControlState(): ControlState {
    return {
        selectedDatasetId: "local",
        selectedVariableName: "conc_chl",
        selectedPlaceGroupIds: null,
        selectedPlaceId: null,
        selectedUserPlaceId: null,
        selectedTime: null,
        selectedTimeRange: null,
        visibleTimeRange: null,
        selectedCoordinate: null,
        selectedDrawMode: "Point",
        timeSeriesUpdateMode: "replace",
        flyTo: null,
    };
}