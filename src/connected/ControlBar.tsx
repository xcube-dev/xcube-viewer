/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import * as React from "react";
import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import ControlBarComponent from "@/components/ControlBar";
import { WithLocale } from "@/util/lang";
import DatasetSelect from "./DatasetSelect";
import VariableSelect from "./VariableSelect";
import PlaceGroupsSelect from "./PlaceGroupsSelect";
import PlaceSelect from "./PlaceSelect";
import MapInteractionsBar from "./MapInteractionsBar";
import TimeSelect from "./TimeSelect";
import TimeSlider from "./TimeSlider";
import TimePlayer from "./TimePlayer";
import ControlBarActions from "./ControlBarActions";
import Divider from "@mui/material/Divider";
import DimensionSelect from "@/connected/DimensionSelect";

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
      <Divider orientation={"vertical"} variant="middle" flexItem></Divider>
      <VariableSelect />
      <Divider orientation={"vertical"} variant="middle" flexItem></Divider>
      <DimensionSelect />
      <Divider orientation={"vertical"} variant="middle" flexItem></Divider>
      <PlaceGroupsSelect />
      <PlaceSelect />
      <MapInteractionsBar />
      <Divider orientation={"vertical"} variant="middle" flexItem></Divider>
      <TimeSelect />
      <TimePlayer />
      <TimeSlider />
      <ControlBarActions />
    </ControlBarComponent>
  );
};

const ControlBar = connect(mapStateToProps, mapDispatchToProps)(_ControlBar);
export default ControlBar;
