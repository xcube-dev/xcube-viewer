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

import { getLocalStorage } from '../util/storage';
import { ApiServerConfig } from '../model/apiServer';
import { ControlState } from './controlState';
import { getConfigName } from '../config';

export function storeUserServers(userServers: ApiServerConfig[]) {
    const storage = getLocalStorage(getConfigName());
    if (storage) {
        try {
            storage.setObjectItem('userServers', userServers);
        } catch (e) {
            console.warn(`failed to store user servers: ${e}`);
        }
    }
}

export function loadUserServers(): ApiServerConfig[] {
    const storage = getLocalStorage(getConfigName());
    if (storage) {
        try {
            return storage.getObjectItem('userServers', []);
        } catch (e) {
            console.warn(`failed to load user servers: ${e}`);
        }
    }
    return [];
}


export function storeUserSettings(settings: ControlState) {
    const storage = getLocalStorage(getConfigName());
    if (storage) {
        try {
            storage.setPrimitiveProperty('locale', settings);
            storage.setPrimitiveProperty('legalAgreementAccepted', settings);
            storage.setPrimitiveProperty('autoShowTimeSeries', settings);
            storage.setPrimitiveProperty('showTimeSeriesErrorBars', settings);
            storage.setPrimitiveProperty('showTimeSeriesPointsOnly', settings);
            storage.setPrimitiveProperty('showTimeSeriesMedian', settings);
            storage.setPrimitiveProperty('timeAnimationInterval', settings);
            storage.setPrimitiveProperty('timeChunkSize', settings);
            storage.setPrimitiveProperty('infoCardOpen', settings);
            storage.setObjectProperty('infoCardElementStates', settings);
            storage.setPrimitiveProperty('imageSmoothingEnabled', settings);
            storage.setPrimitiveProperty('baseMapUrl', settings);
            storage.setPrimitiveProperty('exportTimeSeries', settings);
            storage.setPrimitiveProperty('exportTimeSeriesSeparator', settings);
            storage.setPrimitiveProperty('exportPlaces', settings);
            storage.setPrimitiveProperty('exportPlacesAsCollection', settings);
            storage.setPrimitiveProperty('exportZipArchive', settings);
            storage.setPrimitiveProperty('exportFileName', settings);
        } catch (e) {
            console.warn(`failed to store user settings: ${e}`);
        }
    }
}

export function loadUserSettings(defaultSettings: ControlState): ControlState {
    const storage = getLocalStorage(getConfigName());
    if (storage) {
        const settings = {...defaultSettings};
        try {
            storage.getStringProperty('locale', settings, defaultSettings);
            storage.getBooleanProperty('legalAgreementAccepted', settings, defaultSettings);
            storage.getBooleanProperty('autoShowTimeSeries', settings, defaultSettings);
            storage.getBooleanProperty('showTimeSeriesErrorBars', settings, defaultSettings);
            storage.getBooleanProperty('showTimeSeriesPointsOnly', settings, defaultSettings);
            storage.getBooleanProperty('showTimeSeriesMedian', settings, defaultSettings);
            storage.getIntProperty('timeAnimationInterval', settings, defaultSettings);
            storage.getIntProperty('timeChunkSize', settings, defaultSettings);
            storage.getBooleanProperty('infoCardOpen', settings, defaultSettings);
            storage.getObjectProperty('infoCardElementStates', settings, defaultSettings);
            storage.getBooleanProperty('imageSmoothingEnabled', settings, defaultSettings);
            storage.getStringProperty('baseMapUrl', settings, defaultSettings);
            storage.getBooleanProperty('exportTimeSeries', settings, defaultSettings);
            storage.getStringProperty('exportTimeSeriesSeparator', settings, defaultSettings);
            storage.getBooleanProperty('exportPlaces', settings, defaultSettings);
            storage.getBooleanProperty('exportPlacesAsCollection', settings, defaultSettings);
            storage.getBooleanProperty('exportZipArchive', settings, defaultSettings);
            storage.getStringProperty('exportFileName', settings, defaultSettings);
        } catch (e) {
            console.warn(`failed to load user settings: ${e}`);
        }
        return settings;
    }
    return defaultSettings;
}

