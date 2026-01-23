/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _MapSplitter from "@/components/MapSplitter";
import { updateVariableSplitPos } from "@/actions/controlActions";

const mapStateToProps = (state: AppState) => {
  return {
    hidden: !state.controlState.variableCompareMode,
    position: state.controlState.variableSplitPos,
  };
};

const mapDispatchToProps = {
  updatePosition: updateVariableSplitPos,
};

const MapSplitter = connect(mapStateToProps, mapDispatchToProps)(_MapSplitter);
export default MapSplitter;
