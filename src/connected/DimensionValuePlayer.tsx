/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import _DimensionValuePlayer from "@/components/DimensionValuePlayer";
import { AppState } from "@/states/appState";
import {
  incSelectedDimension,
  selectDimensionValues,
  updateDimensionAnimation,
} from "@/actions/controlActions";
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
    dimensionAnimationActive: state.controlState.dimensionAnimationActive,
    dimensionAnimationInterval: state.controlState.dimensionAnimationInterval,
  };
};

const mapDispatchToProps = {
  selectDimensionValues,
  incSelectedDimension,
  updateDimensionAnimation,
};

const DimensionValuePlayer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_DimensionValuePlayer);
export default DimensionValuePlayer;
