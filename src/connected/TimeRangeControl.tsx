import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import TimeRangeControl from '../components/TimeRangeControl';
import { selectTimeRange, updateVisibleTimeRange } from '../actions/controlActions';
import { selectedDatasetTimeRangeSelector } from '../selectors/controlSelectors';


const mapStateToProps = (state: AppState) => {
    return {
        dataTimeRange: selectedDatasetTimeRangeSelector(state),
        selectedTimeRange: state.controlState.selectedTimeRange,
        visibleTimeRange: state.controlState.visibleTimeRange,

}
};

const mapDispatchToProps = {
    selectTimeRange,
    updateVisibleTimeRange,
};

export default connect(mapStateToProps, mapDispatchToProps)(TimeRangeControl);
