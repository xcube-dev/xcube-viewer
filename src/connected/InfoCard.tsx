import { connect } from 'react-redux';
import {
    infoCardElementViewModesSelector,
    selectedDatasetSelector,
    selectedPlaceInfoSelector,
    selectedVariableSelector,
    visibleInfoCardElementsSelector
} from '../selectors/controlSelectors';

import { AppState } from '../states/appState';
import {
    setVisibleInfoCardElements,
    showInfoCard,
    updateInfoCardElementViewMode,
} from '../actions/controlActions';
import InfoCard from '../components/InfoCard';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        infoCardOpen: state.controlState.infoCardOpen,
        visibleInfoCardElements: visibleInfoCardElementsSelector(state),
        infoCardElementViewModes: infoCardElementViewModesSelector(state),
        selectedDataset: selectedDatasetSelector(state),
        selectedVariable: selectedVariableSelector(state),
        selectedPlaceInfo: selectedPlaceInfoSelector(state),
    }
};

const mapDispatchToProps = {
    showInfoCard,
    setVisibleInfoCardElements,
    updateInfoCardElementViewMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoCard);
