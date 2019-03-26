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
    timeAnimationActive: boolean;
    timeAnimationInterval: number;
    flyTo: ol.geom.SimpleGeometry | ol.Extent | null;
    activities: { [id: string]: string };
    locale: string;
    dialogOpen: {[dialogId: string]: boolean};
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
        timeAnimationActive: false,
        timeAnimationInterval: 500,
        flyTo: null,
        activities: {},
        locale: "en",
        dialogOpen: {},
    };
}