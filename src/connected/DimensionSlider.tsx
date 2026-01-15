/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _DimensionSlider from "@/components/DimensionSlider";
import { selectDimensionCoordinate } from "@/actions/controlActions";
import {
  selectedDimensionCoordinateSelector,
  selectedDimensionSelector,
} from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    hasDimension: !!selectedDimensionSelector(state),
    dimension: selectedDimensionSelector(state),
    selectedDimensionCoordinate: selectedDimensionCoordinateSelector(state),
    /*    ,
    selectedTime: state.controlState.selectedTime,
    selectedTimeRange: state.controlState.selectedTimeRange,*/
  };
};

const mapDispatchToProps = {
  selectDimensionCoordinate,
};

const DimensionSlider = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_DimensionSlider);
export default DimensionSlider;
