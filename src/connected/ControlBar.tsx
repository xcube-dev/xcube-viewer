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

import * as React from "react";
import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import ControlBarComponent from "@/components/ControlBar";
import { WithLocale } from "@/util/lang";
import DatasetSelect from "./DatasetSelect";
import VariableSelect from "./VariableSelect";
// import RgbSwitch from "./RgbSwitch";
import PlaceGroupsSelect from "./PlaceGroupsSelect";
import PlaceSelect from "./PlaceSelect";
import MapInteractionsBar from "./MapInteractionsBar";
import TimeSelect from "./TimeSelect";
import TimeSlider from "./TimeSlider";
import TimePlayer from "./TimePlayer";
import ControlBarActions from "./ControlBarActions";

interface ControlBarProps extends WithLocale {
  show: boolean;
}

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,
    show: state.dataState.datasets.length > 0,
  };
};

const mapDispatchToProps = {};

const _ControlBar: React.FC<ControlBarProps> = ({ show }) => {
  if (!show) {
    return null;
  }
  return (
    <ControlBarComponent>
      <DatasetSelect />
      <VariableSelect />
      {/*<RgbSwitch />*/}
      <PlaceGroupsSelect />
      <PlaceSelect />
      <MapInteractionsBar />
      <TimeSelect />
      <TimePlayer />
      <TimeSlider />
      <ControlBarActions />
    </ControlBarComponent>
  );
};

const ControlBar = connect(mapStateToProps, mapDispatchToProps)(_ControlBar);
export default ControlBar;
