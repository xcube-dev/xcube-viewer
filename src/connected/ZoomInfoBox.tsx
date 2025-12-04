/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { setZoomLevel } from "@/actions/controlActions";
import _ZoomInfoBox from "@/components/ZoomInfoBox/ZoomInfoBox";
import {
  selectedDatasetLevelSelector,
  selectedDatasetResolutionsSelector,
  zoomLevelSelector,
} from "@/selectors/controlSelectors";
import { AppState } from "@/states/appState";

const mapStateToProps = (state: AppState) => {
  return {
    style: { left: "0.5em", bottom: 40 },
    zoomLevel: zoomLevelSelector(state),
    datasetLevel: selectedDatasetLevelSelector(state),
    datasetLevels: selectedDatasetResolutionsSelector(state).length,
    visibility: state.controlState.showZoomInfoBox,
  };
};

const mapDispatchToProps = { setZoomLevel };

const ZoomInfoBox = connect(mapStateToProps, mapDispatchToProps)(_ZoomInfoBox);
export default ZoomInfoBox;
