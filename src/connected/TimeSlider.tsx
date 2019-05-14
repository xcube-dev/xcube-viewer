import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import TimeSlider from '../components/TimeSlider';
import { selectTime, selectTimeRange, updateVisibleTimeRange } from '../actions/controlActions';
import { snapTimesSelector } from "../selectors/controlSelectors";


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,

        selectedTime: state.controlState.selectedTime,
        selectedTimeRange: state.controlState.selectedTimeRange,
        visibleTimeRange: state.controlState.visibleTimeRange,
        snapTimes: snapTimesSelector(state),
    };
};

const mapDispatchToProps = {
    selectTime,
    selectTimeRange,
    updateVisibleTimeRange,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSlider);
