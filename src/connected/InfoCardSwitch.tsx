import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import InfoCardSwitch from '../components/InfoCardSwitch';
import { showInfoCard } from '../actions/controlActions';

const mapStateToProps = (state: AppState) => {
    return {
        selectedDatasetId: state.controlState.selectedDatasetId,
        infoCardOpen: state.controlState.infoCardOpen,
    }
};

const mapDispatchToProps = {
    showInfoCard
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoCardSwitch);
