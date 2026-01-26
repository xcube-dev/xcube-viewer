/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _ExportDialog from "@/components/ExportDialog";
import { closeDialog, updateSettings } from "@/actions/controlActions";
import { exportData } from "@/actions/dataActions";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    open: Boolean(state.controlState.dialogOpen["export"]),
    settings: state.controlState,
  };
};

const mapDispatchToProps = {
  closeDialog,
  updateSettings,
  downloadTimeSeries: exportData,
};

const ExportDialog = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_ExportDialog);
export default ExportDialog;
