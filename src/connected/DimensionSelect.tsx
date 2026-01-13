/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import _DimensionSelect from "@/components/DimensionSelect";
import { AppState } from "@/states/appState";
import { selectDimensionCoordinate } from "@/actions/controlActions";
import {
  selectedDimensionSelector,
  selectedDimensionCoordinateSelector,
  selectedVariableSelector,
} from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    selectedVariable: selectedVariableSelector(state),
    dimension: selectedDimensionSelector(state),
    selectedDimensionCoordinate: selectedDimensionCoordinateSelector(state),
  };
};

const mapDispatchToProps = {
  selectDimensionCoordinate,
};

const DimensionSelect = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_DimensionSelect);
export default DimensionSelect;
