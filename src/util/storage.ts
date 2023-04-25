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
            try {
                return parser ? parser(value): value;
            } catch (e) {
                console.error(`Failed parsing user setting "${propertyName}": ${e}`);
            }
        }
        return defaultValue;
    }

    getObjectItem(propertyName: string, defaultValue?: any): any {
        return this.getItem(propertyName, defaultValue, (value) => JSON.parse(value));
    }

    getBooleanProperty<T>(propertyName: keyof T, target: T, defaultObj: T) {
        this.getProperty(propertyName, target, defaultObj, (value) => value === 'true');
    }

    getIntProperty(propertyName: string, target: any, defaultObj: any) {
        this.getProperty(propertyName, target, defaultObj, parseInt);
    }

    getStringProperty<T>(propertyName: keyof T, target: T, defaultObj: T) {
        this.getProperty(propertyName, target, defaultObj, (value) => value);
    }

    getObjectProperty<T>(propertyName: keyof T, target: T, defaultObj: T) {
        this.getProperty(propertyName, target, defaultObj,
            (value) => {
                const parsedObj = JSON.parse(value);
                const defaultObjValue = defaultObj[propertyName];
                const resultObj: {[key: string]: any} = {...defaultObjValue, ...parsedObj};
                Object.getOwnPropertyNames(parsedObj).forEach(key => {
                    const defaultValue = (defaultObjValue as any)[key];
                    const parsedValue = parsedObj[key];
                    if (isObject(defaultValue) && isObject(parsedValue)) {
                        resultObj[key] = {...defaultValue, ...parsedValue};
                    }
                });
                return resultObj;
        });

    }

    private getProperty<T>(propertyName: keyof T,
                        target: T,
                        defaultObj: T,
                        parser: (value: string) => any) {
        target[propertyName] = this.getItem(propertyName as string, defaultObj[propertyName], parser);
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

    setPrimitiveProperty<T>(propertyName: keyof T, source: T) {
        this.setItem(propertyName as string, source[propertyName]);
    }

    setObjectProperty<T>(propertyName: keyof T, source: T) {
        this.setObjectItem(propertyName as string, source[propertyName]);
    }

    private makeKey(propertyName: string): string {
        return `xcube.${this.brandingName}.${propertyName}`;
    }
}


function isObject(value: any) {
    return Boolean(value) && value.constructor === Object;
}

