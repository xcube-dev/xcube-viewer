/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _DepthSlider from "@/components/DepthSlider";
import { selectDepthCoordinate } from "@/actions/controlActions";
import {
  selectedDepthCoordinateSelector,
  selectedDepthSelector,
  selectedVariableSelector,
} from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    selectedVariable: selectedVariableSelector(state),
    locale: state.controlState.locale,
    depth: selectedDepthSelector(state),
    selectedDepthCoordinate: selectedDepthCoordinateSelector(state),
  };
};

const mapDispatchToProps = {
  selectDepthCoordinate,
};

const DepthSlider = connect(mapStateToProps, mapDispatchToProps)(_DepthSlider);
export default DepthSlider;
