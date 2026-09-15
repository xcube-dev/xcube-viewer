/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import _CoordinateValueControl from "@/components/CoordinateValueControl";
import { AppState } from "@/states/appState";
import {
  selectedDimensionLabelSelector,
  selectedVariableSelector,
  showAllDimensionsSelector,
} from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    selectedVariable: selectedVariableSelector(state),
    selectedDimensionLabel: selectedDimensionLabelSelector(state),
    showAllDimensions: showAllDimensionsSelector(state),
  };
};

const mapDispatchToProps = {};

const CoordinateValueControl = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_CoordinateValueControl);
export default CoordinateValueControl;
