/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _LayerControlPanel from "@/components/LayerControlPanel";
import {
  openDialog,
  setLayerMenuOpen,
  setLayerVisibility,
} from "@/actions/controlActions";
import { layerStatesSelector } from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    layerMenuOpen: state.controlState.layerMenuOpen,
    layerStates: layerStatesSelector(state),
  };
};

const mapDispatchToProps = {
  openDialog,
  setLayerMenuOpen,
  setLayerVisibility,
};

const LayerControlPanel = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_LayerControlPanel);
export default LayerControlPanel;
