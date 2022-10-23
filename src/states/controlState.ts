/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2021 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Extent as OlExtent } from 'ol/extent';
import { Geometry as OlGeometry } from 'ol/geom';
import { default as OlBaseObject } from 'ol/Object';
import { Config } from '../config';

import { Time, TimeRange } from '../model/timeSeries';
import { loadUserSettings } from './userSettings';
import { DEFAULT_MAP_CRS } from "../model/proj";


export type TimeAnimationInterval = 250 | 500 | 1000 | 2500;
export const TIME_ANIMATION_INTERVALS: TimeAnimationInterval[] = [250, 500, 1000, 2500];

export type MapInteraction = 'Select' | 'Point' | 'Polygon' | 'Circle';


export interface InfoCardElementState {
    visible?: boolean;
    viewMode?: string;
}

export interface InfoCardElementStates {
    [key: string]: InfoCardElementState;
}

export interface ExportSettings {
    format: "GeoJSON" | "CSV";
    multiFile: boolean;
    zipArchive: boolean;
}

export type VolumeRenderMode = 'mip' | 'iso';
export type VolumeStatus = 'loading' | 'ok' | 'error';
export type VolumeState = { status: VolumeStatus; message?: string; };
export type VolumeStates = { [volumeId: string]: VolumeState };

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
    timeChunkSize: number;
    autoShowTimeSeries: boolean;
    showTimeSeriesPointsOnly: boolean;
    showTimeSeriesErrorBars: boolean;
    showTimeSeriesMedian: boolean;
    flyTo: OlGeometry | OlExtent | null;
    activities: { [id: string]: string };
    locale: string;
    dialogOpen: { [dialogId: string]: boolean };
    legalAgreementAccepted: boolean;
    mapInteraction: MapInteraction;
    volumeCardOpen: boolean;
    volumeRenderMode: VolumeRenderMode;
    volumeStates: VolumeStates;
    infoCardOpen: boolean;
    infoCardElementStates: InfoCardElementStates;
    mapProjection: string;
    imageSmoothingEnabled: boolean;
    showDatasetBoundaries: boolean;
    baseMapUrl: string;
    showRgbLayer: boolean;
    exportTimeSeries: boolean;
    exportPlaces: boolean;
    exportTimeSeriesSeparator: string;
    exportPlacesAsCollection: boolean;
    exportZipArchive: boolean;
    exportFileName: string;
}


export function newControlState(): ControlState {
    const branding = Config.instance.branding;
    const state: ControlState = {
        selectedDatasetId: null,
        selectedVariableName: null,
        selectedPlaceGroupIds: ['user'],
        selectedPlaceId: null,
        selectedUserPlaceId: null,
        selectedServerId: Config.instance.server.id,
        selectedTime: null,
        selectedTimeRange: null,
        timeSeriesUpdateMode: 'add',
        timeAnimationActive: false,
        timeAnimationInterval: 1000,
        timeChunkSize: 20,
        autoShowTimeSeries: true,
        showTimeSeriesPointsOnly: false,
        showTimeSeriesErrorBars: true,
        showTimeSeriesMedian: branding.defaultAgg === 'median',
        flyTo: null,
        activities: {},
        locale: 'en',
        dialogOpen: {},
        legalAgreementAccepted: false,
        mapInteraction: 'Point',
        showRgbLayer: false,
        volumeCardOpen: false,
        volumeRenderMode: 'mip',
        volumeStates: {},
        infoCardOpen: false,
        infoCardElementStates: {
            dataset: {visible: true, viewMode: 'text'},
            variable: {visible: true, viewMode: 'text'},
            place: {visible: true, viewMode: 'text'},
        },
        mapProjection: branding.mapProjection || DEFAULT_MAP_CRS,
        imageSmoothingEnabled: false,
        showDatasetBoundaries: false,
        baseMapUrl: branding.baseMapUrl || 'http://a.tile.osm.org/{z}/{x}/{y}.png',
        exportTimeSeries: true,
        exportTimeSeriesSeparator: 'TAB',
        exportPlaces: true,
        exportPlacesAsCollection: true,
        exportZipArchive: true,
        exportFileName: 'export',
    };
    return loadUserSettings(state);
}

// We cannot keep "MAP_OBJECTS" in control state object, because these objects are (1) not serializable
// and (2) logging actions will cause the browsers to crash

export const MAP_OBJECTS: { [id: string]: OlBaseObject } = {};
