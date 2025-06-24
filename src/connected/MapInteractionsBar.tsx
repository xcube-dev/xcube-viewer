/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import _MapInteractionsBar from "@/components/MapInteractionsBar";
import { AppState } from "@/states/appState";
import { setMapInteraction } from "@/actions/controlActions";
import { postMessage } from "@/actions/messageLogActions";

const mapStateToProps = (state: AppState) => {
  return {
    mapInteraction: state.controlState.mapInteraction,
  };
};

const mapDispatchToProps = {
  setMapInteraction,
  postMessage,
};

const MapInteractionsBar = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_MapInteractionsBar);
export default MapInteractionsBar;
