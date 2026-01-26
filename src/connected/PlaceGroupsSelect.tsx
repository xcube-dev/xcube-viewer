/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import _PlaceGroupsSelect from "@/components/PlaceGroupsSelect";
import { AppState } from "@/states/appState";
import {
  renameUserPlaceGroup,
  removeUserPlaceGroup,
} from "@/actions/dataActions";
import { selectPlaceGroups } from "@/actions/controlActions";
import {
  selectedDatasetAndUserPlaceGroupsSelector,
  selectedPlaceGroupsTitleSelector,
} from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,

    selectedPlaceGroupIds: state.controlState.selectedPlaceGroupIds,
    placeGroups: selectedDatasetAndUserPlaceGroupsSelector(state),
    selectedPlaceGroupsTitle: selectedPlaceGroupsTitleSelector(state),
  };
};

const mapDispatchToProps = {
  selectPlaceGroups,
  renameUserPlaceGroup,
  removeUserPlaceGroup,
};

const PlaceGroupsSelect = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_PlaceGroupsSelect);
export default PlaceGroupsSelect;
