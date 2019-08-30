import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import TimePlayer from '../components/TimePlayer';
import { selectTime, incSelectedTime, updateTimeAnimation } from '../actions/controlActions';


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

export default connect(mapStateToProps, mapDispatchToProps)(TimePlayer);
