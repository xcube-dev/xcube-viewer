/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _ProgressBar from "@/components/ProgressBar";
import { progressBarSelector } from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    enabled: progressBarSelector(state),
    progress: state.controlState.progressBarSize,
    visibility: state.controlState.progressBarVisibility,
  };
};

const mapDispatchToProps = {};

const ProgressBar = connect(mapStateToProps, mapDispatchToProps)(_ProgressBar);
export default ProgressBar;
