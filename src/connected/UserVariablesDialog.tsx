/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import { updateDatasetUserVariables } from "@/actions/dataActions";
import { closeDialog, selectVariable } from "@/actions/controlActions";
import { USER_VARIABLES_DIALOG_ID } from "@/components/UserVariablesDialog/utils";
import {
  selectedDatasetSelector,
  selectedServerSelector,
  selectedUserVariablesSelector,
  selectedVariableNameSelector,
} from "@/selectors/controlSelectors";
import { expressionCapabilitiesSelector } from "@/selectors/dataSelectors";
import _UserVariablesDialog from "@/components/UserVariablesDialog";

const mapStateToProps = (state: AppState) => {
  return {
    open: state.controlState.dialogOpen[USER_VARIABLES_DIALOG_ID],
    selectedDataset: selectedDatasetSelector(state),
    selectedVariableName: selectedVariableNameSelector(state),
    userVariables: selectedUserVariablesSelector(state),
    expressionCapabilities: expressionCapabilitiesSelector(state),
    serverUrl: selectedServerSelector(state).url,
    themeMode: state.controlState.themeMode,
  };
};

const mapDispatchToProps = {
  closeDialog,
  selectVariable,
  updateDatasetUserVariables,
};

const UserVariablesDialog = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_UserVariablesDialog);
export default UserVariablesDialog;
