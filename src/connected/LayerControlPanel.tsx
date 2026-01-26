/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _LayerControlPanel from "@/components/LayerControlPanel";
import {
  openDialog,
  setLayerGroupStates,
  setLayerMenuOpen,
  setLayerVisibilities,
} from "@/actions/controlActions";
import { layerStatesSelector } from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    layerMenuOpen: state.controlState.layerMenuOpen,
    layerStates: layerStatesSelector(state),
    layerGroupStates: state.controlState.layerGroupStates,
  };
};

// noinspection JSUnusedGlobalSymbols
const mapDispatchToProps = {
  openDialog,
  setLayerMenuOpen,
  setLayerVisibilities,
  setLayerGroupStates,
};

const LayerControlPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_LayerControlPanel);
export default LayerControlPanel;
