import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import TimeSeriesChart from '../components/TimeSeriesChart';
import { selectTime, selectTimeRange } from "../actions/controlActions";


const mapStateToProps = (state: AppState) => {
    return {
        timeSeriesCollection: state.dataState.timeSeriesCollection,
        selectedTime: state.controlState.selectedTime,
        selectedTimeRange:  state.controlState.selectedTimeRange,
    }
};

const mapDispatchToProps = {
    selectTime,
    selectTimeRange,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSeriesChart);
