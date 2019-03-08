import { connect } from 'react-redux';

import VariableSelect from "../components/VariableSelect";
import { AppState } from '../states/appState';
import { selectVariable } from '../actions/controlActions';
import { selectedDatasetVariablesSelector } from '../selectors/controlSelectors';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,

        selectedVariableName: state.controlState.selectedVariableName,
        variables: selectedDatasetVariablesSelector(state),
    };
};

const mapDispatchToProps = {
    selectVariable,
};

export default connect(mapStateToProps, mapDispatchToProps)(VariableSelect);
