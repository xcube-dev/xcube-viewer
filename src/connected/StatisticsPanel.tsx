/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import {
  canAddStatisticsSelector,
  resolvedStatisticsRecordsSelector,
  selectedDatasetSelector,
  selectedDatasetTimeLabelSelector,
  selectedPlaceInfoSelector,
  selectedVariableSelector,
} from "@/selectors/controlSelectors";
import _StatisticsPanel from "@/components/StatisticsPanel";
import { addStatistics, removeStatistics } from "@/actions/dataActions";
import { postMessage } from "@/actions/messageLogActions";
import { statisticsLoadingSelector } from "@/selectors/dataSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    selectedDataset: selectedDatasetSelector(state),
    selectedVariable: selectedVariableSelector(state),
    selectedTime: selectedDatasetTimeLabelSelector(state),
    selectedPlaceInfo: selectedPlaceInfoSelector(state),
    statisticsLoading: statisticsLoadingSelector(state),
    statisticsRecords: resolvedStatisticsRecordsSelector(state),
    canAddStatistics: canAddStatisticsSelector(state),
  };
};

const mapDispatchToProps = {
  addStatistics,
  removeStatistics,
  postMessage,
};

const StatisticsPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_StatisticsPanel);
export default StatisticsPanel;
