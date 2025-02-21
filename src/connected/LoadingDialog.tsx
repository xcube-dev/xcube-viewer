/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _LoadingDialog from "@/components/LoadingDialog";
import { activityMessagesSelector } from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    messages: activityMessagesSelector(state),
  };
};

const mapDispatchToProps = {};

const LoadingDialog = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_LoadingDialog);
export default LoadingDialog;
