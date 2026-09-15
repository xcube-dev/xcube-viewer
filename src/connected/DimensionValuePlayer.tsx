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
  updateAnimationDimension,
} from "@/actions/controlActions";
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
    activeAnimationDimension: state.controlState.activeAnimationDimension,
    dimensionAnimationInterval: state.controlState.dimensionAnimationInterval,
  };
};

const mapDispatchToProps = {
  selectDimensionValues,
  incSelectedDimension,
  updateAnimationDimension,
};

const DimensionValuePlayer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_DimensionValuePlayer);
export default DimensionValuePlayer;
