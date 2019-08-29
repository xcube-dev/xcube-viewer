import { connect } from 'react-redux';

import VariableSelect from "../components/VariableSelect";
import { AppState } from '../states/appState';
import { addTimeSeries } from "../actions/dataActions";
import { selectVariable } from '../actions/controlActions';
import { canAddTimeSeriesSelector, selectedDatasetVariablesSelector } from '../selectors/controlSelectors';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,

        selectedVariableName: state.controlState.selectedVariableName,
        canAddTimeSeries: canAddTimeSeriesSelector(state),
        variables: selectedDatasetVariablesSelector(state),
    };
};

const mapDispatchToProps = {
    selectVariable,
    addTimeSeries,
};

export default connect(mapStateToProps, mapDispatchToProps)(VariableSelect);
