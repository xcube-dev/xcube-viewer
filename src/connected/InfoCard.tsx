import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import { showInfoCard } from '../actions/controlActions';
import InfoCard from '../components/InfoCard';


const mapStateToProps = (state: AppState) => {
    return {
        infoCardOpen: state.controlState.infoCardOpen,
    }
};

const mapDispatchToProps = {
    showInfoCard
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoCard);
