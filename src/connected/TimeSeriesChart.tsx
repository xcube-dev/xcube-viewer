import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import TimeSeriesChart from '../components/TimeSeriesChart';
import { removeAllTimeSeries } from "../actions/dataActions";
import { selectTime, selectTimeRange } from "../actions/controlActions";
import { selectedDatasetTimeRangeSelector } from '../selectors/controlSelectors';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,

        timeSeriesCollection: state.dataState.timeSeriesCollection,
        selectedTime: state.controlState.selectedTime,
        selectedTimeRange:  state.controlState.selectedTimeRange,
        dataTimeRange: selectedDatasetTimeRangeSelector(state),
    }
};

const mapDispatchToProps = {
    selectTime,
    selectTimeRange,
    removeAllTimeSeries
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSeriesChart);
