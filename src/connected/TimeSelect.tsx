import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import TimeSelect from '../components/TimeSelect';
import { selectTime, selectTimeRange, updateTimeAnimation } from '../actions/controlActions';
import { UNIT } from "../model/timeSeries";


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,

        selectedTime: state.controlState.selectedTime,
        selectedTimeRange: state.controlState.selectedTimeRange,
        step: UNIT.days,
        timeAnimationActive: state.controlState.timeAnimationActive,
        timeAnimationInterval: state.controlState.timeAnimationInterval,
    };
};

const mapDispatchToProps = {
    selectTime,
    selectTimeRange,
    updateTimeAnimation,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSelect);
