/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { isObject } from "@/util/types";

export interface NativeStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  length: number;
}

export function getLocalStorage(brandingName: string): Storage | null {
  return _getStorage("localStorage", brandingName);
}

function _getStorage(
  type: "localStorage" | "sessionStorage",
  brandingName: string,
): Storage | null {
  try {
    const storage = window[type];
    const x = "__storage_test__";
    storage.setItem(x, x);
    storage.removeItem(x);
    return new Storage(storage as NativeStorage, brandingName);
  } catch (_e) {
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

  getItem(
    propertyName: string,
    defaultValue?: unknown,
    parser?: (value: string) => unknown,
    converter?: (value: unknown) => unknown,
  ): unknown {
    const value = this.nativeStorage.getItem(this.makeKey(propertyName));
    if (value !== null) {
      try {
        const result = parser ? parser(value) : value;
        return converter ? converter(result) : result;
      } catch (e) {
        console.error(`Failed parsing user setting "${propertyName}": ${e}`);
      }
    }
    return typeof defaultValue === "undefined" ? null : defaultValue;
  }

  getObjectItem<T extends object>(propertyName: string, defaultValue?: T): T {
    return this.getItem(propertyName, defaultValue, (value) =>
      JSON.parse(value),
    ) as T;
  }

  getBooleanProperty<T extends object>(
    propertyName: keyof T,
    target: T,
    defaultObj: T,
  ) {
    this.getProperty(
      propertyName,
      target,
      defaultObj,
      (value) => value === "true",
    );
  }

  getIntProperty<T extends object>(
    propertyName: keyof T,
    target: T,
    defaultObj: T,
  ) {
    this.getProperty(propertyName, target, defaultObj, parseInt);
  }

  getStringProperty<T extends object>(
    propertyName: keyof T,
    target: T,
    defaultObj: T,
  ) {
    this.getProperty(propertyName, target, defaultObj, (value) => value);
  }

  getArrayProperty<T extends object>(
    propertyName: keyof T,
    target: T,
    defaultObj: T,
    converter?: (value: unknown) => unknown,
  ) {
    this.getProperty(
      propertyName,
      target,
      defaultObj,
      (value) => {
        const parsedArray = JSON.parse(value);
        if (Array.isArray(parsedArray)) {
          return parsedArray;
        }
        const defaultArray = defaultObj[propertyName];
        if (Array.isArray(defaultArray)) {
          return defaultArray;
        }
        return [];
      },
      converter,
    );
  }

  getObjectProperty<T extends object>(
    propertyName: keyof T,
    target: T,
    defaultObj: T,
  ) {
    this.getProperty(propertyName, target, defaultObj, (value) => {
      const parsedObj = JSON.parse(value);
      const defaultObjValue = defaultObj[propertyName];
      const resultObj = {
        ...defaultObjValue,
        ...parsedObj,
      };
      Object.getOwnPropertyNames(parsedObj).forEach((key) => {
        const defaultValue = (defaultObjValue as Record<string, unknown>)[key];
        const parsedValue = parsedObj[key];
        if (isObject(defaultValue) && isObject(parsedValue)) {
          resultObj[key] = { ...defaultValue, ...parsedValue };
        }
      });
      return resultObj;
    });
  }

  private getProperty<T extends object>(
    propertyName: keyof T,
    target: T,
    defaultObj: T,
    parser: (value: string) => unknown,
    converter?: (value: unknown) => unknown,
  ) {
    (target as Record<keyof T, unknown>)[propertyName] = this.getItem(
      propertyName as string,
      (defaultObj as Record<keyof T, unknown>)[propertyName],
      parser,
      converter,
    );
  }

  setItem(
    propertyName: string,
    value: unknown,
    formatter?: (value: unknown) => string,
  ) {
    if (typeof value === "undefined" || value === null) {
      this.nativeStorage.removeItem(this.makeKey(propertyName));
    } else {
      const formattedValue = formatter ? formatter(value) : value + "";
      this.nativeStorage.setItem(this.makeKey(propertyName), formattedValue);
    }
  }

  setObjectItem(propertyName: string, value: unknown) {
    this.setItem(propertyName, value, (value) => JSON.stringify(value));
  }

  setPrimitiveProperty<T extends object>(propertyName: keyof T, source: T) {
    this.setItem(propertyName as string, source[propertyName]);
  }

  setArrayProperty<T extends object>(propertyName: keyof T, source: T) {
    this.setObjectItem(propertyName as string, source[propertyName]);
  }

  setObjectProperty<T extends object>(propertyName: keyof T, source: T) {
    this.setObjectItem(propertyName as string, source[propertyName]);
  }

  private makeKey(propertyName: string): string {
    return `xcube.${this.brandingName}.${propertyName}`;
  }
}
