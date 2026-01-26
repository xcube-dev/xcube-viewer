/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import {
  changeLocale,
  closeDialog,
  openDialog,
  updateSettings,
} from "@/actions/controlActions";
import _SettingsDialog from "@/components/SettingsDialog";
import {
  selectedServerSelector,
  userBaseMapsSelector,
  userOverlaysSelector,
} from "@/selectors/controlSelectors";
import { AppState } from "@/states/appState";
import version from "@/version";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    open: state.controlState.dialogOpen["settings"],
    settings: state.controlState,
    userBaseMapLayers: userBaseMapsSelector(state),
    userOverlayLayers: userOverlaysSelector(state),
    selectedServer: selectedServerSelector(state),
    viewerVersion: version,
    serverInfo: state.dataState.serverInfo,
  };
};

// noinspection JSUnusedGlobalSymbols
const mapDispatchToProps = {
  closeDialog,
  updateSettings,
  changeLocale,
  openDialog,
};

const SettingsDialog = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_SettingsDialog);
export default SettingsDialog;
