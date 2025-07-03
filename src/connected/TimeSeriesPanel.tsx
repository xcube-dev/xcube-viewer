/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
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
  selectedDatasetTitleSelector,
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
    selectedDatasetTitle: selectedDatasetTitleSelector(state),
    exportResolution: state.controlState.exportResolution,
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
