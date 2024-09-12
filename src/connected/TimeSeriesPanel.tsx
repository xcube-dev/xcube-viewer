/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
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

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _TimeSeriesPanel from "@/components/TimeSeriesPanel";
import {
  removeTimeSeries,
  removeTimeSeriesGroup,
  addPlaceGroupTimeSeries,
  addTimeSeries,
} from "@/actions/dataActions";
import {
  selectPlace,
  selectTime,
  selectTimeRange,
} from "@/actions/controlActions";
import { postMessage } from "@/actions/messageLogActions";
import {
  canAddTimeSeriesSelector,
  selectedDatasetTimeRangeSelector,
  selectedPlaceGroupPlacesSelector,
  timeSeriesPlaceInfosSelector,
} from "@/selectors/controlSelectors";
import { placeGroupTimeSeriesSelector } from "@/selectors/dataSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    timeSeriesGroups: state.dataState.timeSeriesGroups,
    selectedTime: state.controlState.selectedTime,
    selectedTimeRange: state.controlState.selectedTimeRange,
    dataTimeRange: selectedDatasetTimeRangeSelector(state),
    chartTypeDefault: state.controlState.timeSeriesChartTypeDefault,
    includeStdev: state.controlState.timeSeriesIncludeStdev,
    placeInfos: timeSeriesPlaceInfosSelector(state),
    places: selectedPlaceGroupPlacesSelector(state),
    placeGroupTimeSeries: placeGroupTimeSeriesSelector(state),
    canAddTimeSeries: canAddTimeSeriesSelector(state),
  };
};

const mapDispatchToProps = {
  selectTime,
  selectTimeRange,
  removeTimeSeries,
  removeTimeSeriesGroup,
  selectPlace,
  addPlaceGroupTimeSeries,
  addTimeSeries,
  postMessage,
};

const TimeSeriesPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_TimeSeriesPanel);
export default TimeSeriesPanel;
