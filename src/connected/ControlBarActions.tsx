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
import _ControlBarActions from "@/components/ControlBarActions";
import { openDialog, setSidebarOpen } from "@/actions/controlActions";
import { Config } from "@/config";
import { updateResources } from "@/actions/dataActions";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    visible: !!(
      state.controlState.selectedDatasetId || state.controlState.selectedPlaceId
    ),
    sidebarOpen: state.controlState.sidebarOpen,
    compact: Config.instance.branding.compact,
    allowRefresh: Config.instance.branding.allowRefresh,
  };
};

const mapDispatchToProps = {
  setSidebarOpen,
  openDialog,
  updateResources,
};

const ControlBarActions = connect(
  mapStateToProps,
  mapDispatchToProps,
)(_ControlBarActions);
export default ControlBarActions;
