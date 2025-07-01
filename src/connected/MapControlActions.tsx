/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _MapControlActions from "@/components/MapControlActions";
import {
  setLayerMenuOpen,
  setMapPointInfoBoxEnabled,
  setVariableCompareMode,
} from "@/actions/controlActions";
import { postMessage } from "@/actions/messageLogActions";

const mapStateToProps = (state: AppState) => {
  return {
    layerMenuOpen: state.controlState.layerMenuOpen,
    variableCompareMode: state.controlState.variableCompareMode,
    mapPointInfoBoxEnabled: state.controlState.mapPointInfoBoxEnabled,
    exportResolution: state.controlState.exportResolution,
  };
};

const mapDispatchToProps = {
  setLayerMenuOpen,
  setVariableCompareMode,
  setMapPointInfoBoxEnabled,
  postMessage,
};

const MapControlActions = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_MapControlActions);
export default MapControlActions;
