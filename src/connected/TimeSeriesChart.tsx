import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import TimeSeriesChart from '../components/TimeSeriesChart';
import { selectTime } from "../actions/controlActions";


const mapStateToProps = (state: AppState) => {
    return {
        timeSeriesCollection: state.dataState.timeSeriesCollection,
        selectedTime: state.controlState.selectedTime,
    }
};

const mapDispatchToProps = {
    selectTime,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSeriesChart);
