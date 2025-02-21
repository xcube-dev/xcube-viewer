/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _LegalAgreementDialog from "@/components/LegalAgreementDialog";
import { updateSettings } from "@/actions/controlActions";
import { syncWithServer } from "@/actions/dataActions";

const mapStateToProps = (state: AppState) => {
  return {
    open: !state.controlState.privacyNoticeAccepted,
    settings: state.controlState,
  };
};

const mapDispatchToProps = {
  updateSettings,
  syncWithServer,
};

const LegalAgreementDialog = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_LegalAgreementDialog);
export default LegalAgreementDialog;
