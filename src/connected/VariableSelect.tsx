/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import _VariableSelect from "@/components/VariableSelect";
import { AppState } from "@/states/appState";
import { addStatistics, addTimeSeries } from "@/actions/dataActions";
import {
  openDialog,
  selectVariable,
  selectVariable2,
} from "@/actions/controlActions";
import {
  canAddTimeSeriesSelector,
  userVariablesAllowedSelector,
  selectedVariablesSelector,
  canAddStatisticsSelector,
} from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    selectedDatasetId: state.controlState.selectedDatasetId,
    selectedVariableName: state.controlState.selectedVariableName,
    selectedDataset2Id: state.controlState.selectedDataset2Id,
    selectedVariable2Name: state.controlState.selectedVariable2Name,
    userVariablesAllowed: userVariablesAllowedSelector(state),
    canAddTimeSeries: canAddTimeSeriesSelector(state),
    canAddStatistics: canAddStatisticsSelector(state),
    variables: selectedVariablesSelector(state),
  };
};

const mapDispatchToProps = {
  openDialog,
  selectVariable,
  selectVariable2,
  addTimeSeries,
  addStatistics,
};

const VariableSelect = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_VariableSelect);
export default VariableSelect;
