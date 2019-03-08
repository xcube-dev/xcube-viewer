import { connect } from 'react-redux';

import TimeSeriesModeSelect from "../components/TimeSeriesModeSelect";
import { AppState } from '../states/appState';
import { selectTimeSeriesUpdateMode } from '../actions/controlActions';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,

        timeSeriesUpdateMode: state.controlState.timeSeriesUpdateMode,
    };
};

const mapDispatchToProps = {
    selectTimeSeriesUpdateMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSeriesModeSelect);
