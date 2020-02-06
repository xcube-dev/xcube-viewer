import { connect } from 'react-redux';

import DatasetSelect from "../components/DatasetSelect";
import { AppState } from '../states/appState';
import { selectDataset } from '../actions/controlActions';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        selectedDatasetId: state.controlState.selectedDatasetId,
        datasets: state.dataState.datasets,
    };
};

const mapDispatchToProps = {
    selectDataset
};

export default connect(mapStateToProps, mapDispatchToProps)(DatasetSelect);
