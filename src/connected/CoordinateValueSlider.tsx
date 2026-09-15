/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import _CoordinateValueSlider from "@/components/CoordinateValueSlider";
import { AppState } from "@/states/appState";
import { selectCoordinateValues } from "@/actions/controlActions";
import {
  effectiveSelectedDimensionLabelSelector,
  selectedDatasetDimensionForLabelSelector,
  selectedDatasetCoordinateValueForLabelSelector,
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
    selectedCoordinateValue: selectedDatasetCoordinateValueForLabelSelector(
      state,
      ownProps.dimensionLabel,
    ),
  };
};

const mapDispatchToProps = {
  selectCoordinateValues,
};

const CoordinateValueSlider = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_CoordinateValueSlider);
export default CoordinateValueSlider;
