/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import _PlaceSelect from "@/components/PlaceSelect";
import { AppState } from "@/states/appState";
import {
  renameUserPlace,
  removeUserPlace,
  restyleUserPlace,
} from "@/actions/dataActions";
import {
  selectPlace,
  locateSelectedPlaceInMap,
  openDialog,
} from "@/actions/controlActions";
import {
  selectedPlaceGroupPlacesSelector,
  selectedPlaceGroupPlaceLabelsSelector,
  selectedPlaceInfoSelector,
} from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    datasets: state.dataState.datasets,
    selectedPlaceGroupIds: state.controlState.selectedPlaceGroupIds,
    selectedPlaceId: state.controlState.selectedPlaceId,
    selectedPlaceInfo: selectedPlaceInfoSelector(state),
    places: selectedPlaceGroupPlacesSelector(state),
    placeLabels: selectedPlaceGroupPlaceLabelsSelector(state),
  };
};

const mapDispatchToProps = {
  selectPlace,
  renameUserPlace,
  restyleUserPlace,
  removeUserPlace,
  locateSelectedPlace: locateSelectedPlaceInMap,
  openDialog,
};

const PlaceSelect = connect(mapStateToProps, mapDispatchToProps)(_PlaceSelect);
export default PlaceSelect;
