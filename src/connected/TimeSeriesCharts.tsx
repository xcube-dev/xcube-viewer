import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import TimeSeriesCharts from '../components/TimeSeriesCharts';
import { removeTimeSeriesGroup } from "../actions/dataActions";
import { selectTime, selectTimeRange } from "../actions/controlActions";
import { selectedDatasetTimeRangeSelector, snapTimesSelector } from '../selectors/controlSelectors';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        timeSeriesGroups: state.dataState.timeSeriesGroups,
        selectedTime: state.controlState.selectedTime,
        selectedTimeRange: state.controlState.selectedTimeRange,
        dataTimeRange: selectedDatasetTimeRangeSelector(state),
        snapTimes: snapTimesSelector(state),
    }
};

const mapDispatchToProps = {
    selectTime,
    selectTimeRange,
    removeTimeSeriesGroup
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSeriesCharts);
