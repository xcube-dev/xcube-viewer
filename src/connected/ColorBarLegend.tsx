import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import {
    selectedVariableNameSelector,
    selectedVariableUnitsSelector,
    selectedVariableColorBarNameSelector,
    selectedVariableColorBarMinMaxSelector,
} from '../selectors/controlSelectors';
import { updateVariableColorBar } from '../actions/dataActions';
import ColorBarLegend from '../components/ColorBarLegend';


const mapStateToProps = (state: AppState) => {
    return {
        variableName: selectedVariableNameSelector(state),
        variableUnits: selectedVariableUnitsSelector(state),
        variableColorBarMinMax: selectedVariableColorBarMinMaxSelector(state),
        variableColorBarName: selectedVariableColorBarNameSelector(state),
        colorBars: state.dataState.colorBars,
    }
};

const mapDispatchToProps = {
    updateVariableColorBar,
};

export default connect(mapStateToProps, mapDispatchToProps)(ColorBarLegend);
