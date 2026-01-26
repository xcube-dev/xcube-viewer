/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _UserControl from "@/components/UserControl";
import { updateAccessToken } from "@/actions/userAuthActions";

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (_state: AppState) => {
  return {};
};

const mapDispatchToProps = {
  updateAccessToken,
};

const UserControl = connect(mapStateToProps, mapDispatchToProps)(_UserControl);
export default UserControl;
