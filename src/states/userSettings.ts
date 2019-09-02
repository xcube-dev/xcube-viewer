import { Storage, getLocalStorage } from '../util/storage';
import { Server } from '../model/server';
import { ControlState } from './controlState';

export function storeUserServers(userServers: Server[]) {
    const storage = getLocalStorage();
    if (storage) {
        let userServersJson = JSON.stringify(userServers);
        try {
            storage.setItem('xcube.userServers', userServersJson);
        } catch (e) {
            console.warn(`failed to store user servers: ${e}`);
        }
    }
}

export function loadUserServers(): Server[] {
    const storage = getLocalStorage();
    if (storage) {
        let userServersJson;
        try {
            userServersJson = storage.getItem('xcube.userServers');
        } catch (e) {
            console.warn(`failed to load user servers: ${e}`);
        }
        if (userServersJson) {
            return JSON.parse(userServersJson) as Server[];
        }
    }
    return [];
}


export function storeUserSettings(settings: ControlState) {
    const storage = getLocalStorage();
    if (storage) {
        try {
            _storeProperty(storage, 'legalAgreementAccepted', settings);
            _storeProperty(storage, 'autoShowTimeSeries', settings);
            _storeProperty(storage, 'showTimeSeriesErrorBars', settings);
            _storeProperty(storage, 'showTimeSeriesPointsOnly', settings);
            _storeProperty(storage, 'timeAnimationInterval', settings);
        } catch (e) {
            console.warn(`failed to store user settings: ${e}`);
        }
    }
}

export function loadUserSettings(defaultSettings: ControlState): ControlState {
    const storage = getLocalStorage();
    if (storage) {
        const settings = {...defaultSettings};
        try {
            _loadBooleanProperty(storage, 'legalAgreementAccepted', settings, defaultSettings);
            _loadBooleanProperty(storage, 'autoShowTimeSeries', settings, defaultSettings);
            _loadBooleanProperty(storage, 'showTimeSeriesErrorBars', settings, defaultSettings);
            _loadBooleanProperty(storage, 'showTimeSeriesPointsOnly', settings, defaultSettings);
            _loadIntProperty(storage, 'timeAnimationInterval', settings, defaultSettings);
        } catch (e) {
            console.warn(`failed to load user settings: ${e}`);
        }
        return settings;
    }
    return defaultSettings;
}


function _storeProperty(storage: Storage, propertyName: string, source: any) {
    storage.setItem(`xcube.${propertyName}`, source[propertyName] + '');
    // console.log(`stored xcube.${propertyName}`, source);
}

function _loadBooleanProperty(storage: Storage, propertyName: string, target: any, defaultObj: any) {
    const value = storage.getItem(`xcube.${propertyName}`);
    if (value !== null) {
        target[propertyName] = value == 'true';
    } else {
        target[propertyName] = !!defaultObj[propertyName];
    }
    // console.log(`loaded xcube.${propertyName}`, target);
}

function _loadIntProperty(storage: Storage, propertyName: string, target: any, defaultObj: any) {
    const value = storage.getItem(`xcube.${propertyName}`);
    if (value !== null) {
        target[propertyName] = parseInt(value);
    } else {
        target[propertyName] = defaultObj[propertyName];
    }
    // console.log(`loaded xcube.${propertyName}`, target);
}

