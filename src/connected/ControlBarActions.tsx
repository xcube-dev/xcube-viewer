/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { Config } from "@/config";
import { type AppState } from "@/states/appState";
import _ControlBarActions from "@/components/ControlBarActions";
import { setSidePanelOpen } from "@/actions/controlActions";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    visible: !!(
      state.controlState.selectedDatasetId || state.controlState.selectedPlaceId
    ),
    sidePanelOpen: state.controlState.sidePanelOpen,
    compact: Config.instance.branding.compact,
  };
};

// noinspection JSUnusedGlobalSymbols
const mapDispatchToProps = {
  setSidePanelOpen,
};

const ControlBarActions = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_ControlBarActions);
export default ControlBarActions;
