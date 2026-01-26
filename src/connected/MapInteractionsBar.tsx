/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import _MapInteractionsBar from "@/components/MapInteractionsBar";
import { AppState } from "@/states/appState";
import { setMapInteraction } from "@/actions/controlActions";

const mapStateToProps = (state: AppState) => {
  return {
    mapInteraction: state.controlState.mapInteraction,
  };
};

const mapDispatchToProps = {
  setMapInteraction,
};

const MapInteractionsBar = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_MapInteractionsBar);
export default MapInteractionsBar;
