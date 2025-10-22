/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { Config } from "@/config";
import { AppState } from "@/states/appState";
import _AppBar from "@/components/AppBar";
import { openDialog } from "@/actions/controlActions";
import { shareStatePermalink, updateResources } from "@/actions/dataActions";

// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    appName: Config.instance.branding.appBarTitle,
    allowRefresh: Config.instance.branding.allowRefresh,
    allowSharing: Config.instance.branding.allowSharing,
    allowDownloads: Config.instance.branding.allowDownloads,
    compact: Config.instance.branding.compact,
  };
};

// noinspection JSUnusedGlobalSymbols
const mapDispatchToProps = { openDialog, updateResources, shareStatePermalink };

const AppBar = connect(mapStateToProps, mapDispatchToProps)(_AppBar);
export default AppBar;
