/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _MessageLog from "@/components/MessageLog";
import { hideMessage } from "@/actions/messageLogActions";

const mapStateToProps = (state: AppState) => {
  const newEntries = state.messageLogState.newEntries;
  return {
    locale: state.controlState.locale,
    message: newEntries.length > 0 ? newEntries[0] : null,
  };
};

const mapDispatchToProps = {
  hideMessage,
};

const MessageLog = connect(mapStateToProps, mapDispatchToProps)(_MessageLog);
export default MessageLog;
