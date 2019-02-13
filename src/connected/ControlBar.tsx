import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import { selectDataset, selectVariable, selectPlace, selectDateTime } from '../actions/controlActions';
import { selectedDatasetVariablesSelector, selectedDatasetPlacesSelector } from "../selectors/controlSelectors";
import ControlBar from '../components/ControlBar';


const mapStateToProps = (state: AppState) => {
    return {
        selectedDatasetId: state.controlState.selectedDatasetId,
        datasets: state.dataState.datasets,

        selectedVariableId: state.controlState.selectedVariableId,
        variables: selectedDatasetVariablesSelector(state),

        selectedPlaceId: state.controlState.selectedPlaceId,
        places: selectedDatasetPlacesSelector(state),

        selectedDateTime: state.controlState.selectedDateTime,
    }
};

const mapDispatchToProps = {
    selectDataset,
    selectVariable,
    selectPlace,
    selectDateTime,
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlBar);
