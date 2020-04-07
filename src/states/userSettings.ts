import { getLocalStorage } from '../util/storage';
import { Server } from '../model/server';
import { ControlState } from './controlState';
import { getBrandingName } from '../config';

export function storeUserServers(userServers: Server[]) {
    const storage = getLocalStorage(getBrandingName());
    if (storage) {
        try {
            storage.setObjectItem('userServers', userServers);
        } catch (e) {
            console.warn(`failed to store user servers: ${e}`);
        }
    }
}

export function loadUserServers(): Server[] {
    const storage = getLocalStorage(getBrandingName());
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
    const storage = getLocalStorage(getBrandingName());
    if (storage) {
        try {
            storage.setPrimitiveProperty('legalAgreementAccepted', settings);
            storage.setPrimitiveProperty('autoShowTimeSeries', settings);
            storage.setPrimitiveProperty('showTimeSeriesErrorBars', settings);
            storage.setPrimitiveProperty('showTimeSeriesPointsOnly', settings);
            storage.setPrimitiveProperty('showTimeSeriesMedian', settings);
            storage.setPrimitiveProperty('timeAnimationInterval', settings);
            storage.setPrimitiveProperty('timeChunkSize', settings);
            storage.setPrimitiveProperty('imageSmoothingEnabled', settings);
            storage.setPrimitiveProperty('infoCardOpen', settings);
            storage.setObjectProperty('infoCardElementStates', settings);
            storage.setPrimitiveProperty('baseMapUrl', settings);
        } catch (e) {
            console.warn(`failed to store user settings: ${e}`);
        }
    }
}

export function loadUserSettings(defaultSettings: ControlState): ControlState {
    const storage = getLocalStorage(getBrandingName());
    if (storage) {
        const settings = {...defaultSettings};
        try {
            storage.getBooleanProperty('legalAgreementAccepted', settings, defaultSettings);
            storage.getBooleanProperty('autoShowTimeSeries', settings, defaultSettings);
            storage.getBooleanProperty('showTimeSeriesErrorBars', settings, defaultSettings);
            storage.getBooleanProperty('showTimeSeriesPointsOnly', settings, defaultSettings);
            storage.getBooleanProperty('showTimeSeriesMedian', settings, defaultSettings);
            storage.getIntProperty('timeAnimationInterval', settings, defaultSettings);
            storage.getIntProperty('timeChunkSize', settings, defaultSettings);
            storage.getBooleanProperty('imageSmoothingEnabled', settings, defaultSettings);
            storage.getBooleanProperty('infoCardOpen', settings, defaultSettings);
            storage.getObjectProperty('infoCardElementStates', settings, defaultSettings);
            storage.getStringProperty('baseMapUrl', settings, defaultSettings);
        } catch (e) {
            console.warn(`failed to load user settings: ${e}`);
        }
        return settings;
    }
    return defaultSettings;
}

