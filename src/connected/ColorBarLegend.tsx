/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import {
  selectedVariableNameSelector,
  selectedVariableTitleSelector,
  selectedVariableUnitsSelector,
  selectedVariableColorBarNameSelector,
  selectedVariableColorBarMinMaxSelector,
  selectedVariableOpacitySelector,
  selectedVariableColorBarNormSelector,
  selectedVariableColorBarSelector,
  colorBarsSelector,
  userColorBarsSelector,
  selectedDatasetTitleSelector,
} from "@/selectors/controlSelectors";
import { updateVariableColorBar } from "@/actions/dataActions";
import {
  addUserColorBar,
  removeUserColorBar,
  storeSettings,
  updateUserColorBar,
  updateUserColorBars,
} from "@/actions/controlActions";
import _ColorBarLegend from "@/components/ColorBarLegend";

const mapStateToProps = (state: AppState) => {
  return {
    datasetTitle: selectedDatasetTitleSelector(state),
    variableName: selectedVariableNameSelector(state),
    variableTitle: selectedVariableTitleSelector(state),
    variableUnits: selectedVariableUnitsSelector(state),
    variableColorBarName: selectedVariableColorBarNameSelector(state),
    variableColorBarMinMax: selectedVariableColorBarMinMaxSelector(state),
    variableColorBarNorm: selectedVariableColorBarNormSelector(state),
    variableColorBar: selectedVariableColorBarSelector(state),
    variableOpacity: selectedVariableOpacitySelector(state),
    userColorBars: userColorBarsSelector(state),
    colorBars: colorBarsSelector(state),
    style: { right: 10 },
  };
};

const mapDispatchToProps = {
  updateVariableColorBar,
  addUserColorBar,
  removeUserColorBar,
  updateUserColorBar,
  updateUserColorBars,
  storeSettings,
};

const ColorBarLegend = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_ColorBarLegend);
export default ColorBarLegend;
