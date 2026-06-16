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
  effectiveSelectedDimensionLabelSelector,
  selectedDatasetDimensionForLabelSelector,
  selectedDatasetDimensionValueForLabelSelector,
  selectedVariableSelector,
} from "@/selectors/controlSelectors";

interface OwnProps {
  dimensionLabel?: string;
}

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  const selectedDimensionLabel = effectiveSelectedDimensionLabelSelector(
    state,
    ownProps.dimensionLabel,
  );
  return {
    locale: state.controlState.locale,
    selectedVariable: selectedVariableSelector(state),
    selectedDimensionLabel,
    selectedDimension: selectedDatasetDimensionForLabelSelector(
      state,
      ownProps.dimensionLabel,
    ),
    selectedDimensionValue: selectedDatasetDimensionValueForLabelSelector(
      state,
      ownProps.dimensionLabel,
    ),
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
