import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import TimeSlider from '../components/TimeSlider';
import { selectTime, selectTimeRange } from '../actions/controlActions';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,

        selectedTime: state.controlState.selectedTime,
        selectedTimeRange: state.controlState.selectedTimeRange,
    };
};

const mapDispatchToProps = {
    selectTime,
    selectTimeRange,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSlider);
