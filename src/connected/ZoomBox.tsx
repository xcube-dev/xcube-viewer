/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import _ZoomBox from "@/components/ZoomBox";
import { zoomLevelSelector } from "@/selectors/controlSelectors";
import { AppState } from "@/states/appState";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    style: { right: 10, top: 120 },
    zoomLevel: zoomLevelSelector(state),
  };
};

const mapDispatchToProps = {};

const ZoomBox = connect(mapStateToProps, mapDispatchToProps)(_ZoomBox);
export default ZoomBox;
