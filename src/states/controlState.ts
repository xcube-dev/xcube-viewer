import * as ol from 'openlayers';
import { Time, TimeRange } from '../model/timeSeries';
import { VIEWER_DEFAULT_API_SERVER } from '../config';
import { loadUserSettings } from './userSettings';

export type TimeAnimationInterval = 250 | 500 | 1000 | 2500;
export const TIME_ANIMATION_INTERVALS: TimeAnimationInterval[] = [250, 500, 1000, 2500];

export type MapInteraction = 'Select' | 'Point' | 'Polygon' | 'Circle';

export interface ControlState {
    selectedDatasetId: string | null;
    selectedVariableName: string | null;
    selectedPlaceGroupIds: string[] | null;
    selectedPlaceId: string | null;
    selectedUserPlaceId: string | null;
    selectedServerId: string;
    selectedTime: Time | null;
    selectedTimeRange: TimeRange | null;
    timeSeriesUpdateMode: 'add' | 'replace';
    timeAnimationActive: boolean;
    timeAnimationInterval: TimeAnimationInterval;
    autoShowTimeSeries: boolean;
    showTimeSeriesPointsOnly: boolean;
    showTimeSeriesErrorBars: boolean;
    flyTo: ol.geom.SimpleGeometry | ol.Extent | null;
    activities: { [id: string]: string };
    locale: string;
    dialogOpen: { [dialogId: string]: boolean };
    legalAgreementAccepted: boolean;
    mapInteraction: MapInteraction;
}


export function newControlState(): ControlState {
    const state: ControlState = {
        selectedDatasetId: 'local',
        selectedVariableName: 'conc_chl',
        selectedPlaceGroupIds: ['user'],
        selectedPlaceId: null,
        selectedUserPlaceId: null,
        selectedServerId: VIEWER_DEFAULT_API_SERVER.id,
        selectedTime: null,
        selectedTimeRange: null,
        timeSeriesUpdateMode: 'add',
        timeAnimationActive: false,
        timeAnimationInterval: 1000,
        autoShowTimeSeries: false,
        showTimeSeriesPointsOnly: false,
        showTimeSeriesErrorBars: true,
        flyTo: null,
        activities: {},
        locale: 'en',
        dialogOpen: {},
        legalAgreementAccepted: false,
        mapInteraction: 'Point',
    };
    return loadUserSettings(state);
}

// We cannot keep "MAP_OBJECTS" in control state object, because these objects are (1) not serializable
// and (2) logging actions will cause the browsers to crash

export const MAP_OBJECTS: { [id: string]: ol.Object } = {};
