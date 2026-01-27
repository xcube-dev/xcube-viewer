/*
 * Copyright (c) 2019-2026 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import { connect } from "react-redux";

import { AppState } from "@/states/appState";
import _TimeSelect from "@/components/TimeSelect";
import { selectTime } from "@/actions/controlActions";
import { selectedDatasetTimeDimensionSelector } from "@/selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
  return {
    locale: state.controlState.locale,

    hasTimeDimension: !!selectedDatasetTimeDimensionSelector(state),
    selectedTime: state.controlState.selectedTime,
    selectedTimeRange: state.controlState.selectedTimeRange,
  };
};

const mapDispatchToProps = {
  selectTime,
};

const TimeSelect = connect(mapStateToProps, mapDispatchToProps)(_TimeSelect);
export default TimeSelect;
