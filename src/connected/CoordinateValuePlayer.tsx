/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import _CoordinateValuePlayer from "@/components/CoordinateValuePlayer";
import { AppState } from "@/states/appState";
import {
  incSelectedDimension,
  selectCoordinateValues,
  updateAnimationDimension,
} from "@/actions/controlActions";
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
    activeAnimationDimension: state.controlState.activeAnimationDimension,
    dimensionAnimationInterval: state.controlState.dimensionAnimationInterval,
  };
};

const mapDispatchToProps = {
  selectCoordinateValues,
  incSelectedDimension,
  updateAnimationDimension,
};

const CoordinateValuePlayer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_CoordinateValuePlayer);
export default CoordinateValuePlayer;
