import { connect } from 'react-redux';

import ControlBar from "../components/ControlBar";
import { AppState } from '../states/appState';
import {
    selectDataset,
    selectVariable,
    selectPlaceGroups,
    selectPlace,
    selectTime,
    selectTimeSeriesUpdateMode,
} from '../actions/controlActions';
import {
    selectedDatasetVariablesSelector,
    selectedDatasetSelectedPlaceGroupPlacesSelector,
    selectedDatasetPlaceGroupsSelector,
    selectedDatasetSelectedPlaceGroupsTitleSelector, selectedDatasetSelectedPlaceGroupPlaceLabelsSelector
} from '../selectors/controlSelectors';


const mapStateToProps = (state: AppState) => {
    return {
        selectedDatasetId: state.controlState.selectedDatasetId,
        datasets: state.dataState.datasets,

        selectedVariableName: state.controlState.selectedVariableName,
        variables: selectedDatasetVariablesSelector(state),

        selectedPlaceGroupIds: state.controlState.selectedPlaceGroupIds,
        placeGroups: selectedDatasetPlaceGroupsSelector(state),
        selectedPlaceGroupsTitle: selectedDatasetSelectedPlaceGroupsTitleSelector(state),

        selectedPlaceId: state.controlState.selectedPlaceId,
        places: selectedDatasetSelectedPlaceGroupPlacesSelector(state),
        placeLabels: selectedDatasetSelectedPlaceGroupPlaceLabelsSelector(state),

        selectedTime: state.controlState.selectedTime,

        timeSeriesUpdateMode: state.controlState.timeSeriesUpdateMode,
    };
};

const mapDispatchToProps = {
    selectDataset,
    selectVariable,
    selectPlaceGroups,
    selectPlace,
    selectTime,
    selectTimeSeriesUpdateMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlBar);
