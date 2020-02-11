export interface NativeStorage {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
    clear: () => void;
    length: number;
}

export function getLocalStorage(brandingName: string): Storage | null {
    return _getStorage('localStorage', brandingName);
}

export function getSessionStorage(brandingName: string): Storage | null {
    return _getStorage('sessionStorage', brandingName);
}

function _getStorage(type: 'localStorage' | 'sessionStorage', brandingName: string): Storage | null {
    try {
        const storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return new Storage(storage as NativeStorage, brandingName);
    } catch (e) {
        return null;
    }
}

export class Storage {

    private readonly nativeStorage: NativeStorage;
    private readonly brandingName: string;

    constructor(nativeStorage: NativeStorage, brandingName: string) {
        this.nativeStorage = nativeStorage;
        this.brandingName = brandingName;
    }

    getItem(propertyName: string, defaultValue?: any, parser?: (value: string) => any): any {
        let value = this.nativeStorage.getItem(this.makeKey(propertyName));
        if (value !== null) {
            return parser ? parser(value) : value;
        } else {
            return defaultValue;
        }
    }

    getObjectItem(propertyName: string, defaultValue?: any): any {
        return this.getItem(propertyName, defaultValue, (value) => JSON.parse(value));
    }

    getBooleanProperty(propertyName: string, target: any, defaultObj: any) {
        this.getProperty(propertyName, target, defaultObj, (value) => value === 'true');
    }

    getIntProperty(propertyName: string, target: any, defaultObj: any) {
        this.getProperty(propertyName, target, defaultObj, parseInt);
    }

    getStringProperty(propertyName: string, target: any, defaultObj: any) {
        this.getProperty(propertyName, target, defaultObj, (value) => value);
    }

    getObjectProperty(propertyName: string, target: any, defaultObj: any) {
        this.getProperty(propertyName, target, defaultObj, (value) => JSON.parse(value));
    }

    private getProperty(propertyName: string,
                        target: any,
                        defaultObj: any,
                        parser: (value: string) => any) {
        target[propertyName] = this.getItem(propertyName, defaultObj[propertyName], parser);
    }

    setItem(propertyName: string, value: any, formatter?: (value: any) => string) {
        if (typeof value === 'undefined' || value === null) {
            this.nativeStorage.removeItem(this.makeKey(propertyName));
        } else {
            const formattedValue = formatter ? formatter(value) : value + '';
            this.nativeStorage.setItem(this.makeKey(propertyName), formattedValue);
        }
    }

    setObjectItem(propertyName: string, value: any) {
        this.setItem(propertyName, value, (value) => JSON.stringify(value));
    }

    setPrimitiveProperty(propertyName: string, source: any) {
        this.setItem(propertyName, source[propertyName]);
    }

    setObjectProperty(propertyName: string, source: any) {
        this.setObjectItem(propertyName, source[propertyName]);
    }

    private makeKey(propertyName: string): string {
        return `xcube.${this.brandingName}.${propertyName}`;
    }
}
