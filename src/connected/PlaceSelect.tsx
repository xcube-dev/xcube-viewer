import { connect } from 'react-redux';

import PlaceSelect from "../components/PlaceSelect";
import { AppState } from '../states/appState';
import { selectPlace } from '../actions/controlActions';
import {
    selectedPlaceGroupPlacesSelector,
    selectedPlaceGroupPlaceLabelsSelector
} from '../selectors/controlSelectors';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,

        datasets: state.dataState.datasets,
        userPlaceGroup: state.dataState.userPlaceGroup,

        selectedPlaceId: state.controlState.selectedPlaceId,
        places: selectedPlaceGroupPlacesSelector(state),
        placeLabels: selectedPlaceGroupPlaceLabelsSelector(state),
    };
};

const mapDispatchToProps = {
    selectPlace,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceSelect);
