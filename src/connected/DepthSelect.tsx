/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import _DepthSelect from "@/components/DepthSelect";
import { AppState } from "@/states/appState";
import { selectDepth } from "@/actions/controlActions";
import {
  selectedDatasetDepthDimensionSelector,
  selectedDepthSelector,
  selectedVariableSelector,
} from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    selectedVariable: selectedVariableSelector(state),
    selectedDepthDimension: selectedDatasetDepthDimensionSelector(state),
    selectedDepth: selectedDepthSelector(state),
  };
};

const mapDispatchToProps = {
  selectDepth,
};

const DepthSelect = connect(mapStateToProps, mapDispatchToProps)(_DepthSelect);
export default DepthSelect;
