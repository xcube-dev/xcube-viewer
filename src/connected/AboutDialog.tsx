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
} from "@/actions/controlActions";
import _AboutDialog from "@/components/AboutDialog";
import { AppState } from "@/states/appState";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    open: Boolean(state.controlState.dialogOpen["about"]),
  };
};

// noinspection JSUnusedGlobalSymbols
const mapDispatchToProps = {
  closeDialog,
  changeLocale,
  openDialog,
};

const AboutDialog = connect(mapStateToProps, mapDispatchToProps)(_AboutDialog);
export default AboutDialog;
