import { connect } from 'react-redux';

import PlaceSelect from "../components/PlaceSelect";
import { AppState } from '../states/appState';
import { selectPlace } from '../actions/controlActions';
import {
    selectedDatasetSelectedPlaceGroupPlacesSelector,
    selectedDatasetSelectedPlaceGroupPlaceLabelsSelector
} from '../selectors/controlSelectors';


const mapStateToProps = (state: AppState) => {
    return {
        datasets: state.dataState.datasets,

        selectedPlaceId: state.controlState.selectedPlaceId,
        places: selectedDatasetSelectedPlaceGroupPlacesSelector(state),
        placeLabels: selectedDatasetSelectedPlaceGroupPlaceLabelsSelector(state),
    };
};

const mapDispatchToProps = {
    selectPlace,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceSelect);
