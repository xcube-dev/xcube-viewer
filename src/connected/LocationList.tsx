import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import { selectLocation, closeLocationList } from '../actions/controlActions';
import LocationList from '../components/LocationList';
import { selectedDatasetLocationGroupSelector } from "../selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
    return {
        selectedLocationId: state.controlState.selectedLocationId,
        locationGroup: selectedDatasetLocationGroupSelector(state),
        isLocationListVisible: state.controlState.componentVisibility.locationList,
    }
};

const mapDispatchToProps = {
    selectLocation,
    closeLocationList,
};

export default connect(mapStateToProps, mapDispatchToProps)(LocationList);
