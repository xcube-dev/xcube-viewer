/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _MapPointInfoBox from "@/components/MapPointInfoBox";
import {
  selectedDataset2Selector,
  selectedDatasetSelector,
  selectedDatasetTimeLabelSelector,
  selectedServerSelector,
  selectedVariable2Selector,
  selectedVariableSelector,
} from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    enabled: state.controlState.mapPointInfoBoxEnabled,
    serverUrl: selectedServerSelector(state).url,
    dataset1: selectedDatasetSelector(state),
    variable1: selectedVariableSelector(state),
    dataset2: selectedDataset2Selector(state),
    variable2: selectedVariable2Selector(state),
    time: selectedDatasetTimeLabelSelector(state),
  };
};

const mapDispatchToProps = {};

const MapPointInfoBox = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_MapPointInfoBox);
export default MapPointInfoBox;
