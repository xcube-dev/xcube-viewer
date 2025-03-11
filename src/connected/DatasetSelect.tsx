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
  locateSelectedDatasetInMap,
} from "@/actions/controlActions";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    selectedDatasetId: state.controlState.selectedDatasetId,
    datasets: state.dataState.datasets,
  };
};

const mapDispatchToProps = {
  selectDataset,
  locateSelectedDataset: locateSelectedDatasetInMap,
};

const DatasetSelect = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_DatasetSelect);
export default DatasetSelect;
