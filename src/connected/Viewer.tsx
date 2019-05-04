import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import {
    selectedColorBarLegendSelector,
    selectedDatasetPlaceGroupLayersSelector,
    selectedDatasetVariableLayerSelector
} from '../selectors/controlSelectors';
import { addGeometry } from '../actions/controlActions';
import Viewer from '../components/Viewer';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        variableLayer: selectedDatasetVariableLayerSelector(state),
        placeGroupLayers: selectedDatasetPlaceGroupLayersSelector(state),
        colorBarLegend: selectedColorBarLegendSelector(state),
        drawMode: state.controlState.selectedDrawMode,
        flyTo: state.controlState.flyTo,
    }
};

const mapDispatchToProps = {
    addGeometry,
};

export default connect(mapStateToProps, mapDispatchToProps)(Viewer);
