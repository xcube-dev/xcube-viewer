import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import TimeSeriesChart from '../components/TimeSeriesChart';


const mapStateToProps = (state: AppState) => {
    return {
        timeSeriesCollection: state.dataState.timeSeriesCollection,
    }
};

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSeriesChart);
