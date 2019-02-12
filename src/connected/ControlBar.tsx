import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import { selectDataset, selectVariable, selectLocation, selectDateTime } from '../actions/controlActions';
import { selectedDatasetVariablesSelector, selectedDatasetLocationsSelector } from "../selectors/controlSelectors";
import ControlBar from '../components/ControlBar';

const mapStateToProps = (state: AppState) => {
    return {
        selectedDatasetId: state.controlState.selectedDatasetId,
        datasets: state.dataState.datasets,

        selectedVariableId: state.controlState.selectedVariableId,
        variables: selectedDatasetVariablesSelector(state),

        selectedLocationId: state.controlState.selectedLocationId,
        locations: selectedDatasetLocationsSelector(state),

        dateTime: state.controlState.selectedDateTime,
    }
};

const mapDispatchToProps = {
    selectDataset,
    selectVariable,
    selectLocation,
    selectDateTime,
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlBar);
