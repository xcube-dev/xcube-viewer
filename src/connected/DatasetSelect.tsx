import { connect } from 'react-redux';

import DatasetSelect from "../components/DatasetSelect";
import { AppState } from '../states/appState';
import { selectDataset, flyToDataset, showInfoCard } from '../actions/controlActions';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        selectedDatasetId: state.controlState.selectedDatasetId,
        datasets: state.dataState.datasets,
    };
};

const mapDispatchToProps = {
    selectDataset,
    flyToDataset,
    showInfoCard,
};

export default connect(mapStateToProps, mapDispatchToProps)(DatasetSelect);
