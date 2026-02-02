/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _DepthPlayer from "@/components/DepthPlayer";
import {
  incSelectedDepth,
  updateDepthAnimation,
  selectDepth,
} from "@/actions/controlActions";
import {
  selectedDepthSelector,
  selectedDatasetDepthDimensionSelector,
  selectedVariableSelector,
} from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    selectedVariable: selectedVariableSelector(state),
    selectedDepthDimension: selectedDatasetDepthDimensionSelector(state),
    selectedDepth: selectedDepthSelector(state),
    depthAnimationActive: state.controlState.depthAnimationActive,
    dimensionAnimationInterval: state.controlState.dimensionAnimationInterval,
  };
};

const mapDispatchToProps = {
  selectDepth,
  incSelectedDepth,
  updateDepthAnimation,
};

const DepthPlayer = connect(mapStateToProps, mapDispatchToProps)(_DepthPlayer);
export default DepthPlayer;
