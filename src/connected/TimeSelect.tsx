import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import TimeSelect from '../components/TimeSelect';
import { selectTime, selectTimeRange, incSelectedTime, updateTimeAnimation } from '../actions/controlActions';


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
    selectTimeRange,
    incSelectedTime,
    updateTimeAnimation,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSelect);
