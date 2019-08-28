import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import { addTimeSeries, removeAllTimeSeries } from '../actions/dataActions';
import TimeSeriesControl from '../components/TimeSeriesControl';


const mapStateToProps = (state: AppState) => {
    return {};
};

const mapDispatchToProps = {
    addTimeSeries,
    removeAllTimeSeries,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSeriesControl);
