/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { closeDialog, updateSettings } from "@/actions/controlActions";
import { AppState } from "@/states/appState";
import _UserLayersDialog from "@/components/UserLayersDialog";

interface OwnProps {
  dialogId: "userOverlays" | "userBaseMaps";
}

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  return {
    open: state.controlState.dialogOpen[ownProps.dialogId],
    settings: state.controlState,
    dialogId: ownProps.dialogId,
  };
};

const mapDispatchToProps = {
  closeDialog,
  updateSettings,
};

const UserLayersDialog = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_UserLayersDialog);
export default UserLayersDialog;
