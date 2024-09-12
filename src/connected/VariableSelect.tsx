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
