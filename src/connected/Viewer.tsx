import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import { selectedVariableLayerSelector } from "../selectors/controlSelectors";
import { selectCoordinate } from '../actions/controlActions';
import Viewer from '../components/Viewer';


const mapStateToProps = (state: AppState) => {
    return {
        variableLayer: selectedVariableLayerSelector(state),
        drawMode: state.controlState.selectedDrawMode,
    }
};

const mapDispatchToProps = {
    selectCoordinate,
};

export default connect(mapStateToProps, mapDispatchToProps)(Viewer);
