/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import {
  infoCardElementViewModesSelector,
  selectedDatasetSelector,
  selectedPlaceInfoSelector,
  selectedServerSelector,
  selectedTimeSelector,
  selectedVariableSelector,
  visibleInfoCardElementsSelector,
} from "@/selectors/controlSelectors";
import { AppState } from "@/states/appState";
import {
  setVisibleInfoCardElements,
  updateInfoCardElementViewMode,
} from "@/actions/controlActions";
import _InfoPanel from "@/components/InfoPanel";
import { Config } from "@/config";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    visibleInfoCardElements: visibleInfoCardElementsSelector(state),
    infoCardElementViewModes: infoCardElementViewModesSelector(state),
    selectedDataset: selectedDatasetSelector(state),
    selectedVariable: selectedVariableSelector(state),
    selectedPlaceInfo: selectedPlaceInfoSelector(state),
    selectedTime: selectedTimeSelector(state),
    serverConfig: selectedServerSelector(state),
    allowViewModePython: !!Config.instance.branding.allowViewModePython,
  };
};

const mapDispatchToProps = {
  setVisibleInfoCardElements,
  updateInfoCardElementViewMode,
};

const InfoPanel = connect(mapStateToProps, mapDispatchToProps)(_InfoPanel);
export default InfoPanel;
