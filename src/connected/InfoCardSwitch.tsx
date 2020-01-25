import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import InfoCardSwitch from '../components/InfoCardSwitch';
import { showInfoCard, flyToSelectedObject } from '../actions/controlActions';

const mapStateToProps = (state: AppState) => {
    return {
        visible: !!(state.controlState.selectedDatasetId || state.controlState.selectedPlaceId),
        infoCardOpen: state.controlState.infoCardOpen,
    }
};

const mapDispatchToProps = {
    showInfoCard,
    flyToSelectedObject,
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoCardSwitch);
