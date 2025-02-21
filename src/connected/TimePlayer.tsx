/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _TimePlayer from "@/components/TimePlayer";
import {
  selectTime,
  incSelectedTime,
  updateTimeAnimation,
} from "@/actions/controlActions";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,

    selectedTime: state.controlState.selectedTime,
    selectedTimeRange: state.controlState.selectedTimeRange,
    timeAnimationActive: state.controlState.timeAnimationActive,
    timeAnimationInterval: state.controlState.timeAnimationInterval,
  };
};

const mapDispatchToProps = {
  selectTime,
  incSelectedTime,
  updateTimeAnimation,
};

const TimePlayer = connect(mapStateToProps, mapDispatchToProps)(_TimePlayer);
export default TimePlayer;
