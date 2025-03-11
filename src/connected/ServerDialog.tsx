/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _ServerDialog from "@/components/ServerDialog";
import { closeDialog } from "@/actions/controlActions";
import { configureServers } from "@/actions/dataActions";
import { selectedServerSelector } from "@/selectors/controlSelectors";
import { userServersSelector } from "@/selectors/dataSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    open: !!state.controlState.dialogOpen["server"],
    servers: userServersSelector(state),
    selectedServer: selectedServerSelector(state),
  };
};

const mapDispatchToProps = {
  closeDialog,
  configureServers,
};

const ServerDialog = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_ServerDialog);
export default ServerDialog;
