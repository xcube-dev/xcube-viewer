import { connect } from 'react-redux';

import MapInteractionsBar from '../components/MapInteractionsBar';
import { AppState } from '../states/appState';
import { setMapInteraction } from '../actions/controlActions';

const mapStateToProps = (state: AppState) => {
    return {
        mapInteraction: state.controlState.mapInteraction,
    };
};

const mapDispatchToProps = {
    setMapInteraction,
};

export default connect(mapStateToProps, mapDispatchToProps)(MapInteractionsBar);
