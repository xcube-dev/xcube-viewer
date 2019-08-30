import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import TimeSelect from '../components/TimeSelect';
import { selectTime } from '../actions/controlActions';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,

        selectedTime: state.controlState.selectedTime,
        selectedTimeRange: state.controlState.selectedTimeRange,
    };
};

const mapDispatchToProps = {
    selectTime,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeSelect);
