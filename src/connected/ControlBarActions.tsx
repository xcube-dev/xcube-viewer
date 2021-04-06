import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import ControlBarActions from '../components/ControlBarActions';
import { showInfoCard, flyToSelectedObject } from '../actions/controlActions';

const mapStateToProps = (state: AppState) => {
    return {
            locale: state.controlState.locale,
        visible: !!(state.controlState.selectedDatasetId || state.controlState.selectedPlaceId),
        infoCardOpen: state.controlState.infoCardOpen,
        timeSeriesGroups: state.dataState.timeSeriesGroups,
    }
};

const mapDispatchToProps = {
    showInfoCard,
    flyToSelectedObject,
};

export default connect(mapStateToProps, mapDispatchToProps)(ControlBarActions);
