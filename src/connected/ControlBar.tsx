import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import { selectDataset, selectVariable, selectPlace, selectTime, selectTimeSeriesUpdateMode } from '../actions/controlActions';
import { selectedDatasetVariablesSelector, selectedDatasetPlacesSelector } from "../selectors/controlSelectors";
import ControlBar from '../components/ControlBar';


const mapStateToProps = (state: AppState) => {
    return {
        selectedDatasetId: state.controlState.selectedDatasetId,
        datasets: state.dataState.datasets,

        selectedVariableName: state.controlState.selectedVariableName,
        variables: selectedDatasetVariablesSelector(state),

        selectedPlaceId: state.controlState.selectedPlaceId,
        places: selectedDatasetPlacesSelector(state),

        selectedTime: state.controlState.selectedTime,

        timeSeriesUpdateMode : state.controlState.timeSeriesUpdateMode,
    }
};

const mapDispatchToProps = {
    selectDataset,
    selectVariable,
    selectPlace,
    selectTime,
    selectTimeSeriesUpdateMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlBar);
