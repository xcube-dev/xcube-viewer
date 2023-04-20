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

import { Config } from '../config';
import i18n from '../i18n';
import { ApiServerConfig, ApiServerInfo } from "../model/apiServer";
import { ColorBars } from '../model/colorBar';
import { Dataset } from '../model/dataset';
import { Place, PlaceGroup, USER_DRAWING_PLACE_GROUP_ID, } from '../model/place';
import { TimeSeriesGroup } from '../model/timeSeries';
import { loadUserServers } from './userSettings';

export interface DataState {
    serverInfo: ApiServerInfo | null;
    datasets: Dataset[];
    colorBars: ColorBars | null;
    timeSeriesGroups: TimeSeriesGroup[];
    userPlaceGroups: PlaceGroup[];  // Will contain at least 1 item
    userServers: ApiServerConfig[]; // Will contain at least 1 item
}

export function newDataState(): DataState {
    const extraUserServers = loadUserServers();
    const userServers = [
        {...Config.instance.server},
    ];
    extraUserServers.forEach(extraUserServer => {
        if (!userServers.find(userServer => userServer.id === extraUserServer.id)) {
            userServers.push(extraUserServer);
        }
    });
    return {
        serverInfo: null,
        datasets: [],
        colorBars: null,
        timeSeriesGroups: [],
        userPlaceGroups: [{
            id: USER_DRAWING_PLACE_GROUP_ID,
            title: i18n.get('My places'),
            type: "FeatureCollection",
            features: [] as Array<Place>
        }],
        userServers,
    };
}

