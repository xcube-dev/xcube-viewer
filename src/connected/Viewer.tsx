import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import {
    selectedColorBarLegendSelector,
    selectedDatasetPlaceGroupLayersSelector,
    selectedDatasetVariableLayerSelector, selectedPlaceGroupPlacesSelector
} from '../selectors/controlSelectors';
import { addUserPlace } from '../actions/dataActions';
import Viewer from '../components/Viewer';
import { userPlaceGroupSelector } from "../selectors/dataSelectors";
import { selectPlace } from "../actions/controlActions";


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        variableLayer: selectedDatasetVariableLayerSelector(state),
        placeGroupLayers: selectedDatasetPlaceGroupLayersSelector(state),
        colorBarLegend: selectedColorBarLegendSelector(state),
        userPlaceGroup: userPlaceGroupSelector(state),
        mapInteraction: state.controlState.mapInteraction,
        flyTo: state.controlState.flyTo,
        selectedPlaceId: state.controlState.selectedPlaceId,
        places: selectedPlaceGroupPlacesSelector(state),
    }
};

const mapDispatchToProps = {
    addUserPlace,
    selectPlace,
};

export default connect(mapStateToProps, mapDispatchToProps)(Viewer);
