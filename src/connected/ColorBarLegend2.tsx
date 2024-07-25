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
  selectedVariable2NameSelector,
  selectedVariable2TitleSelector,
  selectedVariable2UnitsSelector,
  selectedVariable2ColorBarNameSelector,
  selectedVariable2ColorBarMinMaxSelector,
  selectedVariable2ColorBarNormSelector,
  selectedVariable2OpacitySelector,
  selectedVariable2ColorBarSelector,
  colorBarsSelector,
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
  return {
    variableName: selectedVariable2NameSelector(state),
    variableTitle: selectedVariable2TitleSelector(state),
    variableUnits: selectedVariable2UnitsSelector(state),
    variableColorBarName: selectedVariable2ColorBarNameSelector(state),
    variableColorBarMinMax: selectedVariable2ColorBarMinMaxSelector(state),
    variableColorBarNorm: selectedVariable2ColorBarNormSelector(state),
    variableColorBar: selectedVariable2ColorBarSelector(state),
    variableOpacity: selectedVariable2OpacitySelector(state),
    userColorBars: userColorBarsSelector(state),
    colorBars: colorBarsSelector(state),
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
