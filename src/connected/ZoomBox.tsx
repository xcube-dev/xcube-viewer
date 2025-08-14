/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import _ZoomBox from "@/components/ZoomBox";
import { getDatasetLevel } from "@/model/dataset";
import {
  mapProjectionSelector,
  selectedDatasetResolutionsSelector,
  selectedDatasetSpatialUnitsSelector,
  zoomLevelSelector,
} from "@/selectors/controlSelectors";
import { AppState } from "@/states/appState";

const mapStateToProps = (state: AppState) => {
  const datasetResolutions = selectedDatasetResolutionsSelector(state);
  const datasetSpatialUnits = selectedDatasetSpatialUnitsSelector(state);
  const mapProjection = mapProjectionSelector(state);

  return {
    style: { right: 10, top: 120 },
    zoomLevel: zoomLevelSelector(state),
    datasetLevel: () =>
      getDatasetLevel(datasetResolutions, datasetSpatialUnits, mapProjection),
  };
};

const mapDispatchToProps = {};

const ZoomBox = connect(mapStateToProps, mapDispatchToProps)(_ZoomBox);
export default ZoomBox;
