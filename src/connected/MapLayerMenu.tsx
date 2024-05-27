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
import _MapLayerMenu from "@/components/MapLayerMenu";
import {
  openDialog,
  setLayerMenuOpen,
  setLayerVisibility,
  setVariableCompareMode,
} from "@/actions/controlActions";
import {
  layerDisablementsSelector,
  layerSubtitlesSelector,
  layerTitlesSelector,
  layerVisibilitiesSelector,
} from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    layerTitles: layerTitlesSelector(state),
    layerSubtitles: layerSubtitlesSelector(state),
    layerDisablements: layerDisablementsSelector(state),
    layerVisibilities: layerVisibilitiesSelector(state),
    variableCompareMode: state.controlState.variableCompareMode,
  };
};

const mapDispatchToProps = {
  openDialog,
  setLayerMenuOpen,
  setLayerVisibility,
  setVariableCompareMode,
};

const MapLayerMenu = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_MapLayerMenu);
export default MapLayerMenu;
