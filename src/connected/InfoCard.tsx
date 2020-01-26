import { connect } from 'react-redux';
import {
    infoCardElementCodeModesSelector,
    selectedDatasetSelector,
    selectedPlaceInfoSelector,
    selectedVariableSelector,
    visibleInfoCardElementsSelector
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
        locale: state.controlState.locale,
        infoCardOpen: state.controlState.infoCardOpen,
        visibleInfoCardElements: visibleInfoCardElementsSelector(state),
        infoCardElementCodeModes: infoCardElementCodeModesSelector(state),
        selectedDataset: selectedDatasetSelector(state),
        selectedVariable: selectedVariableSelector(state),
        selectedPlaceInfo: selectedPlaceInfoSelector(state),
    }
};

const mapDispatchToProps = {
    showInfoCard,
    setVisibleInfoCardElements,
    updateInfoCardElementCodeMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoCard);
