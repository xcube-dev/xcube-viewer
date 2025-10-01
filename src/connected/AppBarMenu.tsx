/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { changeLocale, openDialog } from "@/actions/controlActions";
import _AppBarMenu from "@/components/AppBarMenu";
import { AppState } from "@/states/appState";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
  };
};

// noinspection JSUnusedGlobalSymbols
const mapDispatchToProps = {
  changeLocale,
  openDialog,
};

const AppBarMenu = connect(mapStateToProps, mapDispatchToProps)(_AppBarMenu);
export default AppBarMenu;
