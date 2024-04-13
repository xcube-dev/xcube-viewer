/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { connect } from "react-redux";
import { default as OlMap } from "ol/Map";

import { AppState } from "@/states/appState";
import {
  baseMapLayerSelector,
  imageSmoothingSelector,
  mapProjectionSelector,
  selectedDatasetBoundaryLayerSelector,
  selectedDatasetPlaceGroupLayersSelector,
  selectedDatasetRgbLayerSelector,
  selectedDatasetVariableLayerSelector,
  selectedPlaceGroupPlacesSelector,
  userPlaceGroupsVisibilitySelector,
} from "@/selectors/controlSelectors";
import {
  addDrawnUserPlace,
  importUserPlacesFromText,
} from "@/actions/dataActions";
import _Viewer from "@/components/Viewer";
import { userPlaceGroupsSelector } from "@/selectors/dataSelectors";
import { selectPlace } from "@/actions/controlActions";
import ColorBarLegend from "./ColorBarLegend";

interface OwnProps {
  onMapRef?: (map: OlMap | null) => void;
}

const mapStateToProps = (state: AppState, ownProps: OwnProps) => {
  return {
    locale: state.controlState.locale,
    variableLayer: selectedDatasetVariableLayerSelector(state),
    rgbLayer: selectedDatasetRgbLayerSelector(state),
    datasetBoundaryLayer: selectedDatasetBoundaryLayerSelector(state),
    placeGroupLayers: selectedDatasetPlaceGroupLayersSelector(state),
    colorBarLegend: <ColorBarLegend />,
    userDrawnPlaceGroupName: state.controlState.userDrawnPlaceGroupName,
    userPlaceGroups: userPlaceGroupsSelector(state),
    userPlaceGroupsVisibility: userPlaceGroupsVisibilitySelector(state),
    mapId: "map",
    mapInteraction: state.controlState.mapInteraction,
    mapProjection: mapProjectionSelector(state),
    selectedPlaceId: state.controlState.selectedPlaceId,
    places: selectedPlaceGroupPlacesSelector(state),
    baseMapLayer: baseMapLayerSelector(state),
    imageSmoothing: imageSmoothingSelector(state),
    onMapRef: ownProps.onMapRef,
  };
};

const mapDispatchToProps = {
  addDrawnUserPlace,
  importUserPlacesFromText,
  selectPlace,
};

const Viewer = connect(mapStateToProps, mapDispatchToProps)(_Viewer);
export default Viewer;
