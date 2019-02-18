import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import { selectedColorBarLegendSelector, selectedVariableLayerSelector } from '../selectors/controlSelectors';
import { selectCoordinate } from '../actions/controlActions';
import Viewer from '../components/Viewer';


const mapStateToProps = (state: AppState) => {
    return {
        variableLayer: selectedVariableLayerSelector(state),
        colorBarLegend: selectedColorBarLegendSelector(state),
        drawMode: state.controlState.selectedDrawMode,
        flyTo: state.controlState.flyTo,
    }
};

const mapDispatchToProps = {
    selectCoordinate,
};

export default connect(mapStateToProps, mapDispatchToProps)(Viewer);
