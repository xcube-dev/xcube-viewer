import { connect } from 'react-redux';
import {
    infoCardElementCodeModesSelector,
    selectedDatasetSelector,
    selectedPlaceSelector,
    selectedVariableSelector, visibleInfoCardElementsSelector
} from '../selectors/controlSelectors';

import { AppState } from '../states/appState';
import {
    setVisibleInfoCardElements,
    showInfoCard,
    updateInfoCardElementCodeMode,
} from '../actions/controlActions';
import InfoCard from '../components/InfoCard';


const mapStateToProps = (state: AppState) => {
    return {
        infoCardOpen: state.controlState.infoCardOpen,
        visibleInfoCardElements: visibleInfoCardElementsSelector(state),
        infoCardElementCodeModes: infoCardElementCodeModesSelector(state),
        selectedDataset: selectedDatasetSelector(state),
        selectedVariable: selectedVariableSelector(state),
        selectedPlace: selectedPlaceSelector(state),
    }
};

const mapDispatchToProps = {
    showInfoCard,
    setVisibleInfoCardElements,
    updateInfoCardElementCodeMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoCard);
