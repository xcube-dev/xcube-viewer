/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import {
  selectedDatasetSelector,
  selectedPlaceInfoSelector,
  selectedServerSelector,
  selectedVariableColorBarSelector,
  selectedVariableSelector,
  selectedVolumeIdSelector,
} from "@/selectors/controlSelectors";
import { AppState } from "@/states/appState";
import {
  setVolumeRenderMode,
  updateVolumeState,
} from "@/actions/controlActions";
import { updateVariableVolume } from "@/actions/dataActions";
import _VolumePanel from "@/components/VolumePanel/VolumePanel";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    selectedDataset: selectedDatasetSelector(state),
    selectedVariable: selectedVariableSelector(state),
    selectedPlaceInfo: selectedPlaceInfoSelector(state),
    variableColorBar: selectedVariableColorBarSelector(state),
    volumeRenderMode: state.controlState.volumeRenderMode,
    volumeId: selectedVolumeIdSelector(state),
    volumeStates: state.controlState.volumeStates,
    serverUrl: selectedServerSelector(state).url,
  };
};

const mapDispatchToProps = {
  setVolumeRenderMode,
  updateVolumeState,
  updateVariableVolume,
};

const VolumePanel = connect(mapStateToProps, mapDispatchToProps)(_VolumePanel);
export default VolumePanel;
