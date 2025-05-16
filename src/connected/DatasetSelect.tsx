/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import _DatasetSelect from "@/components/DatasetSelect";
import { AppState } from "@/states/appState";
import {
  selectDataset,
  toggleDatasetRgbLayer,
  locateSelectedDatasetInMap,
} from "@/actions/controlActions";
import { selectedDatasetSelector } from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    selectedDataset: selectedDatasetSelector(state),
    datasets: state.dataState.datasets,
    layerVisibilities: state.controlState.layerVisibilities,
  };
};

const mapDispatchToProps = {
  selectDataset,
  toggleDatasetRgbLayer,
  locateSelectedDataset: locateSelectedDatasetInMap,
};

const DatasetSelect = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_DatasetSelect);
export default DatasetSelect;
