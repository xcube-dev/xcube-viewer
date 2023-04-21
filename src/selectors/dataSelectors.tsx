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

import { AppState } from "../states/appState";
import { createSelector } from "reselect";
import { Dataset } from "../model/dataset";
import { PlaceGroup } from "../model/place";
import { PlaceGroupTimeSeries, placeGroupToTimeSeries } from "../model/timeSeries";

export const datasetsSelector = (state: AppState) => state.dataState.datasets || [];
export const colorBarsSelector = (state: AppState) => state.dataState.colorBars;
export const timeSeriesGroupsSelector = (state: AppState) => state.dataState.timeSeriesGroups;
export const userPlaceGroupSelector = (state: AppState) => state.dataState.userPlaceGroups[0];
export const userPlaceGroupsSelector = (state: AppState) => state.dataState.userPlaceGroups;
export const userServersSelector = (state: AppState) => state.dataState.userServers || [];

export const placeGroupsSelector = createSelector(
    datasetsSelector,
    userPlaceGroupsSelector,
    (datasets: Dataset[], userPlaceGroups: PlaceGroup[]): PlaceGroup[] => {
        const placeGroups: any = {};
        const datasetPlaceGroups: PlaceGroup[] = [];
        datasets.forEach(dataset => {
            if (dataset.placeGroups) {
                dataset.placeGroups.forEach(placeGroup => {
                    if (!placeGroups[placeGroup.id]) {
                        placeGroups[placeGroup.id] = placeGroup;
                        datasetPlaceGroups.push(placeGroup);
                    }
                });
            }
        });
        return [...datasetPlaceGroups, ...userPlaceGroups];
    }
);

export const placeGroupTimeSeriesSelector = createSelector(
    placeGroupsSelector,
    (placeGroups: PlaceGroup[]): PlaceGroupTimeSeries[] => {
        const placeGroupTimeSeries: PlaceGroupTimeSeries[] = [];
        placeGroups.forEach(placeGroup => {
            const timeSeries = placeGroupToTimeSeries(placeGroup);
            if (timeSeries !== null) {
                placeGroupTimeSeries.push(timeSeries);
            }
        });
        return placeGroupTimeSeries;
    }
);

