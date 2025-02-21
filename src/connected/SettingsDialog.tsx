/*
 * Copyright (c) 2019-2025 by xcube team and contributors
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
  baseMapsSelector,
  overlaysSelector,
  selectedServerSelector,
} from "@/selectors/controlSelectors";
import { AppState } from "@/states/appState";
import version from "@/version";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    open: state.controlState.dialogOpen["settings"],
    settings: state.controlState,
    baseMapLayers: baseMapsSelector(state),
    overlayLayers: overlaysSelector(state),
    selectedServer: selectedServerSelector(state),
    viewerVersion: version,
    serverInfo: state.dataState.serverInfo,
  };
};

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
