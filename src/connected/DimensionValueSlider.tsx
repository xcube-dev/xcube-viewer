/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import _DimensionValueSlider from "@/components/DimensionValueSlider";
import { AppState } from "@/states/appState";
import { selectDimensionValues } from "@/actions/controlActions";
import {
  selectedDatasetDimensionSelector,
  selectedDatasetDimensionValueSelector,
  selectedDimensionLabelSelector,
  selectedVariableSelector,
} from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    selectedVariable: selectedVariableSelector(state),
    selectedDimensionLabel: selectedDimensionLabelSelector(state),
    selectedDimension: selectedDatasetDimensionSelector(state),
    selectedDimensionValue: selectedDatasetDimensionValueSelector(state),
  };
};

const mapDispatchToProps = {
  selectDimensionValues,
};

const DimensionValueSlider = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_DimensionValueSlider);
export default DimensionValueSlider;
