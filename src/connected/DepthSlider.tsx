/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _DepthSlider from "@/components/DepthSlider";
import { selectDepth } from "@/actions/controlActions";
import {
  selectedDepthSelector,
  selectedDatasetDepthDimensionSelector,
  selectedVariableSelector,
} from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    selectedVariable: selectedVariableSelector(state),
    locale: state.controlState.locale,
    selectedDepthDimension: selectedDatasetDepthDimensionSelector(state),
    selectedDepth: selectedDepthSelector(state),
  };
};

const mapDispatchToProps = {
  selectDepth,
};

const DepthSlider = connect(mapStateToProps, mapDispatchToProps)(_DepthSlider);
export default DepthSlider;
