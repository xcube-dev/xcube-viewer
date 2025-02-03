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
