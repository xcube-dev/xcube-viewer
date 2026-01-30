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
  selectDepthCoordinate,
} from "@/actions/controlActions";
import {
  selectedDepthCoordinateSelector,
  selectedDepthSelector,
  selectedVariableSelector,
} from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    selectedVariable: selectedVariableSelector(state),
    depth: selectedDepthSelector(state),
    selectedDepthCoordinate: selectedDepthCoordinateSelector(state),
    depthAnimationActive: state.controlState.depthAnimationActive,
    depthAnimationInterval: state.controlState.depthAnimationInterval,
  };
};

const mapDispatchToProps = {
  selectDepthCoordinate,
  incSelectedDepth,
  updateDepthAnimation,
};

const DepthPlayer = connect(mapStateToProps, mapDispatchToProps)(_DepthPlayer);
export default DepthPlayer;
