/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _ControlBarActions from "@/components/ControlBarActions";
import { openDialog, setSidebarOpen } from "@/actions/controlActions";
import { Config } from "@/config";
import { shareStatePermalink, updateResources } from "@/actions/dataActions";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    visible: !!(
      state.controlState.selectedDatasetId || state.controlState.selectedPlaceId
    ),
    sidebarOpen: state.controlState.sidebarOpen,
    compact: Config.instance.branding.compact,
    allowRefresh: Config.instance.branding.allowRefresh,
    allowSharing: Config.instance.branding.allowSharing,
  };
};

const mapDispatchToProps = {
  setSidebarOpen,
  openDialog,
  updateResources,
  shareStatePermalink,
};

const ControlBarActions = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_ControlBarActions);
export default ControlBarActions;
