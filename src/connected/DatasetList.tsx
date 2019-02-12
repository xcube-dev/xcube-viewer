import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import { selectDataset, closeDatasetList } from '../actions/controlActions';
import DatasetList from '../components/DatasetList';

const mapStateToProps = (state: AppState) => {
    return {
        selectedDatasetId: state.controlState.selectedDatasetId,
        datasets: state.dataState.datasets,
        isDatasetListVisible: state.controlState.componentVisibility.datasetList,
    }
};

const mapDispatchToProps = {
    selectDataset,
    closeDatasetList,
};

export default connect(mapStateToProps, mapDispatchToProps)(DatasetList);
