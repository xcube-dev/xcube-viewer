/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import {
  colorBarsSelector,
  selectedDataset2TitleSelector,
  selectedVariable2ColorBarMinMaxSelector,
  selectedVariable2ColorBarNameSelector,
  selectedVariable2ColorBarNormSelector,
  selectedVariable2ColorBarSelector,
  selectedVariable2NameSelector,
  selectedVariable2OpacitySelector,
  selectedVariable2TitleSelector,
  selectedVariable2UnitsSelector,
  userColorBarsSelector,
} from "@/selectors/controlSelectors";
import { updateVariable2ColorBar } from "@/actions/dataActions";
import {
  addUserColorBar,
  removeUserColorBar,
  storeSettings,
  updateUserColorBar,
  updateUserColorBars,
} from "@/actions/controlActions";
import _ColorBarLegend from "@/components/ColorBarLegend";

const mapStateToProps = (state: AppState) => {
  const splitPos = state.controlState.variableSplitPos;
  return {
    datasetTitle: selectedDataset2TitleSelector(state),
    variableName: splitPos ? selectedVariable2NameSelector(state) : null,
    variableTitle: selectedVariable2TitleSelector(state),
    variableUnits: selectedVariable2UnitsSelector(state),
    variableColorBarName: selectedVariable2ColorBarNameSelector(state),
    variableColorBarMinMax: selectedVariable2ColorBarMinMaxSelector(state),
    variableColorBarNorm: selectedVariable2ColorBarNormSelector(state),
    variableColorBar: selectedVariable2ColorBarSelector(state),
    variableOpacity: selectedVariable2OpacitySelector(state),
    userColorBars: userColorBarsSelector(state),
    colorBars: colorBarsSelector(state),
    style: { left: splitPos ? splitPos - 280 : 0 },
  };
};

const mapDispatchToProps = {
  updateVariableColorBar: updateVariable2ColorBar,
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
