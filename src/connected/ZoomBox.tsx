/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import _ZoomBox from "@/components/ZoomBox/ZoomBox";
import {
  getDatasetLevelSelector,
  zoomLevelSelector,
} from "@/selectors/controlSelectors";
import { AppState } from "@/states/appState";

const mapStateToProps = (state: AppState) => {
  return {
    style: { left: "0.5em", bottom: 40 },
    zoomLevel: zoomLevelSelector(state),
    datasetLevel: () => getDatasetLevelSelector(state),
    visibility: state.controlState.showZoomBox,
  };
};

const mapDispatchToProps = {};

const ZoomBox = connect(mapStateToProps, mapDispatchToProps)(_ZoomBox);
export default ZoomBox;
