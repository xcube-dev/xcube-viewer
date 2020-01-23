import { connect } from 'react-redux';
import {
    selectedDatasetSelector,
    selectedPlaceSelector,
    selectedVariableSelector
} from '../selectors/controlSelectors';

import { AppState } from '../states/appState';
import { showInfoCard } from '../actions/controlActions';
import InfoCard from '../components/InfoCard';


const mapStateToProps = (state: AppState) => {
    return {
        infoCardOpen: state.controlState.infoCardOpen,
        selectedDataset: selectedDatasetSelector(state),
        selectedVariable: selectedVariableSelector(state),
        selectedPlace: selectedPlaceSelector(state),
    }
};

const mapDispatchToProps = {
    showInfoCard
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoCard);
