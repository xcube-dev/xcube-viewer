/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";
import { default as OlMap } from "ol/Map";

import { AppState } from "@/states/appState";
import {
  baseMapLayersSelector,
  overlayLayersSelector,
  imageSmoothingSelector,
  mapProjectionSelector,
  selectedDatasetBoundaryLayerSelector,
  selectedDatasetPlaceGroupLayersSelector,
  selectedDatasetRgbLayerSelector,
  selectedDataset2RgbLayerSelector,
  selectedDatasetVariableLayerSelector,
  selectedDatasetVariable2LayerSelector,
  selectedPlaceGroupPlacesSelector,
  userPlaceGroupsVisibilitySelector,
  showUserPlacesLayerSelector,
} from "@/selectors/controlSelectors";
import {
  addDrawnUserPlace,
  importUserPlacesFromText,
} from "@/actions/dataActions";
import _Viewer from "@/components/Viewer";
import { userPlaceGroupsSelector } from "@/selectors/dataSelectors";
import {
  selectPlace,
  setDatasetZLevel,
  setZoomLevel,
} from "@/actions/controlActions";
import ColorBarLegend from "./ColorBarLegend";
import ColorBarLegend2 from "./ColorBarLegend2";
import MapSplitter from "./MapSplitter";
import MapPointInfoBox from "./MapPointInfoBox";
import MapControlActions from "./MapControlActions";
import ZoomInfoBox from "./ZoomInfoBox";

interface OwnProps {
  onMapRef?: (map: OlMap | null) => void;
}

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  return {
    mapId: "map",
    locale: state.controlState.locale,
    variableLayer: selectedDatasetVariableLayerSelector(state),
    variable2Layer: selectedDatasetVariable2LayerSelector(state),
    rgbLayer: selectedDatasetRgbLayerSelector(state),
    rgb2Layer: selectedDataset2RgbLayerSelector(state),
    datasetBoundaryLayer: selectedDatasetBoundaryLayerSelector(state),
    placeGroupLayers: selectedDatasetPlaceGroupLayersSelector(state),
    colorBarLegend: <ColorBarLegend />,
    colorBarLegend2: <ColorBarLegend2 />,
    mapSplitter: <MapSplitter />,
    mapPointInfoBox: <MapPointInfoBox />,
    mapControlActions: <MapControlActions />,
    userDrawnPlaceGroupName: state.controlState.userDrawnPlaceGroupName,
    userPlaceGroups: userPlaceGroupsSelector(state),
    userPlaceGroupsVisibility: userPlaceGroupsVisibilitySelector(state),
    showUserPlaces: showUserPlacesLayerSelector(state),
    mapInteraction: state.controlState.mapInteraction,
    mapProjection: mapProjectionSelector(state),
    selectedPlaceId: state.controlState.selectedPlaceId,
    places: selectedPlaceGroupPlacesSelector(state),
    baseMapLayers: baseMapLayersSelector(state),
    overlayLayers: overlayLayersSelector(state),
    imageSmoothing: imageSmoothingSelector(state),
    variableSplitPos: state.controlState.variableSplitPos,
    onMapRef: ownProps.onMapRef,
    zoomBox: <ZoomInfoBox />,
  };
};

// noinspection JSUnusedGlobalSymbols
const mapDispatchToProps = {
  addDrawnUserPlace,
  importUserPlacesFromText,
  selectPlace,
  setZoomLevel,
  setDatasetZLevel,
};

const Viewer = connect(mapStateToProps, mapDispatchToProps)(_Viewer);
export default Viewer;
