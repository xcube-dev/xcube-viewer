/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2023 by the xcube development team and contributors.
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

import * as  GeoJSON from 'geojson';
import { defaultMemoize } from 'reselect';
import { default as OlWktFormat } from "ol/format/WKT";
import { default as OlGeomPoint } from "ol/geom/Point";
import { default as OlGeoJSONFormat } from "ol/format/GeoJSON";
import { default as OlFeature } from "ol/Feature";
import { default as OlGeometry } from "ol/geom/Geometry";

import { CsvOptions, defaultCsvOptions } from "./user-place/csv";
import { defaultGeoJsonOptions, GeoJsonOptions } from "./user-place/geojson";
import { defaultWktOptions, WktOptions } from "./user-place/wkt";
import { newId } from "../util/id";
import { getUserPlaceColorName } from '../config';
import { parseCsv } from "../util/csv";
import i18n from "../i18n";

export const USER_ID_PREFIX = "user-";

// The ID of the user place group that hold all drawn places.
// This place group will always exist.
export const USER_DRAWING_PLACE_GROUP_ID = USER_ID_PREFIX + "drawing";

/**
 * A place is a GeoJSON feature with a mandatory string ID.
 */
export interface Place extends GeoJSON.Feature {
    id: string;

    [name: string]: any;
}

/**
 * A group of places represented by GeoJSON features.
 */
export interface PlaceGroup extends GeoJSON.FeatureCollection {
    id: string;
    title: string;
    features: Place[];  // note, this can be undefined!
    propertyMapping?: { [role: string]: string };
    placeGroups?: { [placeId: string]: PlaceGroup }; // placeGroups in placeGroups are not yet supported
}

/**
 * Computed place information.
 */
export interface PlaceInfo {
    placeGroup: PlaceGroup;
    place: Place;
    label: string;
    color: string;
    image: string | null;
    description: string | null;
}

export function newUserPlaceGroup(title: string, places: Place[]): PlaceGroup {
    return {
        type: "FeatureCollection",
        features: places,
        id: newId(USER_ID_PREFIX),
        title,
    };
}

export function newUserPlace(geometry: OlGeometry, properties: { [name: string]: any }): Place {
    return {
        type: 'Feature',
        geometry: new OlGeoJSONFormat().writeGeometryObject(geometry),
        properties: properties,
        id: newId(USER_ID_PREFIX),
    };
}

export const DEFAULT_LABEL_PROPERTY_NAMES = mkCases(['label', 'title', 'name', 'id']);
export const DEFAULT_DESCRIPTION_PROPERTY_NAMES = mkCases(['description', 'desc', 'abstract', 'comment']);
export const DEFAULT_COLOR_PROPERTY_NAMES = mkCases(['color']);
export const DEFAULT_IMAGE_PROPERTY_NAMES = mkCases(['image', 'img', 'picture', 'pic']);

export function computePlaceInfo(placeGroup: PlaceGroup, place: Place): PlaceInfo {
    const infoObj = {};
    updatePlaceInfo(infoObj, placeGroup, place, 'label', place.id + '',
        DEFAULT_LABEL_PROPERTY_NAMES);
    updatePlaceInfo(infoObj, placeGroup, place, 'color', getUserPlaceColorName(getPlaceHash(place)),
        DEFAULT_COLOR_PROPERTY_NAMES);
    updatePlaceInfo(infoObj, placeGroup, place, 'image', null,
        DEFAULT_IMAGE_PROPERTY_NAMES);
    updatePlaceInfo(infoObj, placeGroup, place, 'description', null,
        DEFAULT_DESCRIPTION_PROPERTY_NAMES);
    return {placeGroup, place, ...infoObj} as PlaceInfo;
}

export const getPlaceInfo = defaultMemoize(computePlaceInfo);


function updatePlaceInfo(infoObj: { [name: string]: any },
                         placeGroup: PlaceGroup,
                         place: Place,
                         propertyName: string,
                         defaultValue: any,
                         defaultPropertyNames: string[]) {
    let propertyValue;
    const mappedPropertyValue = placeGroup.propertyMapping && placeGroup.propertyMapping[propertyName];
    if (mappedPropertyValue) {
        if (mappedPropertyValue.includes('${')) {
            infoObj[propertyName] = getInterpolatedPropertyValue(place, mappedPropertyValue);
            return;
        }
        if (defaultPropertyNames.length > 0 && defaultPropertyNames[0] !== mappedPropertyValue) {
            defaultPropertyNames = [mappedPropertyValue, ...defaultPropertyNames];
        }
    }
    if (place.properties) {
        propertyValue = getPropertyValue(place.properties, defaultPropertyNames);
    }
    if (propertyValue === undefined) {
        propertyValue = getPropertyValue(place, defaultPropertyNames);
    }
    infoObj[propertyName] = propertyValue || defaultValue;
}

function getInterpolatedPropertyValue(place: Place, propertyValue: string) {
    let interpolatedValue = propertyValue;
    if (place.properties) {
        for (let name of Object.getOwnPropertyNames(place.properties)) {
            if (!interpolatedValue.includes('${')) {
                break;
            }
            const placeHolder = '${' + name + '}';
            if (interpolatedValue.includes(placeHolder)) {
                interpolatedValue = interpolatedValue.replace(placeHolder, `${place.properties[name]}`);
            }
        }
    }
    return interpolatedValue;
}

function getPropertyValue(container: any, propertyNames: string[]) {
    let value;
    for (let propertyName of propertyNames) {
        if (propertyName in container) {
            return container[propertyName];
        }
    }
    // noinspection JSUnusedAssignment
    return value;
}

function mkCases(names: string[]): string[] {
    let nameCases: string[] = [];
    for (let name of names) {
        nameCases = nameCases.concat(name.toLowerCase(),
            name.toUpperCase(),
            name[0].toUpperCase() + name.substr(1).toLowerCase())
    }
    return nameCases;
}

export function forEachPlace(placeGroups: PlaceGroup[], callback: (placeGroup: PlaceGroup, place: Place) => void) {
    placeGroups.forEach(placeGroup => {
        if (isValidPlaceGroup(placeGroup)) {
            placeGroup.features.forEach((place: Place) => {
                callback(placeGroup, place);
            });
        }
    });
}

export function findPlaceInfo(placeGroups: PlaceGroup[], predicate: (placeGroup: PlaceGroup, place: Place) => boolean): PlaceInfo | null {
    for (let placeGroup of placeGroups) {
        if (isValidPlaceGroup(placeGroup)) {
            const place = placeGroup.features.find((place: Place) => predicate(placeGroup, place));
            if (place) {
                return getPlaceInfo(placeGroup, place);
            }
        }
    }
    return null;
}

function getPlaceHash(place: Place): number {
    const id = place.id + '';
    let hash = 0, i, c;
    if (id.length === 0) {
        return hash;
    }
    for (i = 0; i < id.length; i++) {
        c = id.charCodeAt(i);
        hash = ((hash << 5) - hash) + c;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

export function isValidPlaceGroup(placeGroup: PlaceGroup): boolean {
    return !!placeGroup.features;
}

export function findPlaceInPlaceGroup(placeGroup: PlaceGroup, placeId: string | null): Place | null {
    if (!placeId || !isValidPlaceGroup(placeGroup)) {
        return null;
    }
    const place = placeGroup.features.find(place => place.id === placeId);
    if (!!place) {
        return place as Place;
    }
    let subPlaceGroups = placeGroup.placeGroups;
    if (subPlaceGroups) {
        for (let parentPlaceId in subPlaceGroups) {
            const place = findPlaceInPlaceGroup(subPlaceGroups[parentPlaceId], placeId);
            if (!!place) {
                return place;
            }
        }
    }
    return null;
}

export function findPlaceInPlaceGroups(placeGroups: PlaceGroup[], placeId: string | null): Place | null {
    if (placeId) {
        for (let placeGroup of placeGroups) {
            const place = findPlaceInPlaceGroup(placeGroup, placeId);
            if (place !== null) {
                return place;
            }
        }
    }
    return null;
}

let LAST_PLACE_GROUP_ID_CSV = 0;

let LAST_PLACE_LABEL_ID_CSV = 0;
let LAST_PLACE_LABEL_ID_GEOJSON = 0;
let LAST_PLACE_LABEL_ID_WKT = 0;


export function getUserPlacesFromCsv(text: string, options: CsvOptions): PlaceGroup[] {
    let table = parseCsv(text, options);
    if (table.length < 2) {
        throw new Error(i18n.get('Missing header line in CSV'));
    }

    for (let v of table[0]) {
        if (typeof v !== 'string' || v === '') {
            throw new Error(i18n.get('Invalid header line in CSV'));
        }
    }

    const headerRow: string[] = table[0].map(v => v as string);
    const headerRowLC = headerRow.map(v => v.toLowerCase());
    const numColumns = headerRow.length;

    for (let row of table) {
        if (row.length !== numColumns) {
            throw new Error(i18n.get('All rows must have same length'));
        }
    }

    const groupNameLC = options.groupName.toLowerCase();
    const labelNameLC = options.labelName.toLowerCase();
    const xNameLC = options.xName.toLowerCase();
    const yNameLC = options.yName.toLowerCase();
    const geometryNameLC = options.geometryName.toLowerCase();
    const forceGeometry = options.forceGeometry;

    const groupNameIndex = headerRowLC.findIndex(name => name === groupNameLC);
    const labelNameIndex = headerRowLC.findIndex(name => name === labelNameLC);
    const xNameIndex = headerRowLC.findIndex(name => name === xNameLC);
    const yNameIndex = headerRowLC.findIndex(name => name === yNameLC);
    let geometryNameIndex = headerRowLC.findIndex(name => name === geometryNameLC);
    if (forceGeometry || xNameIndex < 0 || yNameIndex < 0 || xNameIndex === yNameIndex) {
        if (geometryNameIndex < 0) {
            throw new Error(i18n.get('No geometry column(s) found'));
        }
    } else {
        geometryNameIndex = -1;
    }

    let groupPrefix = options.groupPrefix.trim();
    if (groupPrefix === '') {
        groupPrefix = defaultCsvOptions.groupPrefix;
    }

    let labelPrefix = options.labelPrefix.trim();
    if (labelPrefix === '') {
        labelPrefix = defaultCsvOptions.labelPrefix;
    }

    let group: string = '';
    if (groupNameIndex === -1) {
        const groupId = ++LAST_PLACE_GROUP_ID_CSV;
        group = `${groupPrefix}${groupId}`;
    }

    const wktFormat = new OlWktFormat();

    const placeGroups: { [group: string]: PlaceGroup } = {};
    let rowIndex = 1;
    let numPlaceGroups = 0;
    let color = getUserPlaceColorName(0);
    for (; rowIndex < table.length; rowIndex++) {
        const dataRow = table[rowIndex];

        if (groupNameIndex >= 0) {
            group = `${dataRow[groupNameIndex]}`;
        }

        let placeGroup = placeGroups[group];
        if (!placeGroup) {
            placeGroup = newUserPlaceGroup(group, []);
            placeGroups[group] = placeGroup;
            color = getUserPlaceColorName(numPlaceGroups);
            numPlaceGroups++;
        }

        let geometry = null;
        if (geometryNameIndex >= 0) {
            const wkt = dataRow[geometryNameIndex];
            if (typeof wkt === 'string') {
                try {
                    geometry = wktFormat.readGeometry(text);
                } catch (e) {
                    // will handle error below
                }
            }
        } else {
            const x = dataRow[xNameIndex];
            const y = dataRow[yNameIndex];
            if (typeof x === 'number' && Number.isFinite(x) && typeof y === 'number' && Number.isFinite(y)) {
                geometry = new OlGeomPoint([x, y]);
            }
        }
        if (geometry === null) {
            throw new Error(i18n.get(`Invalid geometry in data row ${rowIndex}`));
        }

        const geoJsonProps: { [k: string]: number | string | boolean | null } = {};
        dataRow.forEach((propertyValue, index) => {
            if (index !== xNameIndex && index !== yNameIndex && index !== geometryNameIndex) {
                const propertyName = headerRow[index];
                geoJsonProps[propertyName] = propertyValue;
            }
        });

        let label: string;
        if (labelNameIndex >= 0) {
            label = `${dataRow[labelNameIndex]}`;
        } else {
            const labelId = ++LAST_PLACE_LABEL_ID_CSV;
            label = `${labelPrefix}${labelId}`;
        }

        if (!geoJsonProps['color'])
            geoJsonProps['color'] = color;
        if (!geoJsonProps['label'])
            geoJsonProps['label'] = label;
        if (!geoJsonProps['source'])
            geoJsonProps['source'] = 'CSV';

        placeGroup.features.push(newUserPlace(geometry, geoJsonProps));
    }

    return Object.getOwnPropertyNames(placeGroups).map(group => placeGroups[group]);
}

export function getUserPlacesFromGeoJson(text: string, options: GeoJsonOptions): PlaceGroup[] {
    const labelNames = options.labelNames;
    const labelNamesSet = new Set(
        labelNames.split(',')
            .map(name => name.trim().toLowerCase())
            .filter(name => name !== '')
    )
    let labelPrefix = options.labelPrefix.trim();
    if (labelPrefix === '') {
        labelPrefix = defaultGeoJsonOptions.labelPrefix;
    }

    const geoJsonFormat = new OlGeoJSONFormat();

    let features: OlFeature[];
    try {
        features = geoJsonFormat.readFeatures(text);
    } catch (e) {
        try {
            const geometry = geoJsonFormat.readGeometry(text);
            features = [new OlFeature(geometry)];
        } catch (e) {
            throw new Error(i18n.get(`Invalid GeoJSON`));
        }
    }

    const places: Place[] = [];
    features.forEach(feature => {
        const properties = feature.getProperties();
        const geometry = feature.getGeometry();
        if (geometry) {
            let label = '';
            const geoJsonProps: { [k: string]: number | string | boolean | null } = {color: 'red'};
            if (properties) {
                for (let propertyName in properties) {
                    const propertyValue = properties[propertyName];
                    if (propertyValue === null
                        || typeof propertyValue === 'number'
                        || typeof propertyValue === 'string'
                        || typeof propertyValue === 'boolean') {
                        geoJsonProps[propertyName] = propertyValue;
                    }
                    if (label === ''
                        && typeof propertyValue === 'string'
                        && labelNamesSet.has(propertyName.toLowerCase())) {
                        label = propertyValue;
                    }
                }
            }

            if (label === '') {
                const labelId = ++LAST_PLACE_LABEL_ID_GEOJSON;
                label = `${labelPrefix}-${labelId}`;
            }
            geoJsonProps['label'] = label;
            geoJsonProps['source'] = 'GeoJSON';

            places.push(newUserPlace(geometry, geoJsonProps));
        }
    });

    return [newUserPlaceGroup('', places)];
}

export function getUserPlacesFromWkt(text: string, options: WktOptions): PlaceGroup[] {
    let labelPrefix = options.labelPrefix.trim();
    if (labelPrefix === '') {
        labelPrefix = defaultWktOptions.labelPrefix;
    }
    let label = options.label.trim();
    if (label === '') {
        const labelId = ++LAST_PLACE_LABEL_ID_WKT;
        label = `${labelPrefix}${labelId}`;
    }
    try {
        const geometry = new OlWktFormat().readGeometry(text);
        const geoJsonProps = {label, source: 'WKT'};
        const places = [newUserPlace(geometry, geoJsonProps)];
        return [newUserPlaceGroup('', places)];
    } catch (e) {
        throw new Error(i18n.get(`Invalid Geometry WKT`));
    }
}




