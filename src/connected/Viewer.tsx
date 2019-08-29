import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import {
    selectedColorBarLegendSelector,
    selectedDatasetPlaceGroupLayersSelector,
    selectedDatasetVariableLayerSelector
} from '../selectors/controlSelectors';
import { addUserPlace } from '../actions/dataActions';
import Viewer from '../components/Viewer';
import { userPlaceGroupSelector } from "../selectors/dataSelectors";


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        variableLayer: selectedDatasetVariableLayerSelector(state),
        placeGroupLayers: selectedDatasetPlaceGroupLayersSelector(state),
        colorBarLegend: selectedColorBarLegendSelector(state),
        userPlaceGroup: userPlaceGroupSelector(state),
        drawMode: state.controlState.selectedDrawMode,
        flyTo: state.controlState.flyTo,
    }
};

const mapDispatchToProps = {
    addUserPlace,
};

export default connect(mapStateToProps, mapDispatchToProps)(Viewer);
