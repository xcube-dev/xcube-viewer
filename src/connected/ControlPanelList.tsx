import { connect } from 'react-redux';
import ControlPanelList from '../components/ControlPanelList';
import { AppState } from '../states/appState';
import { changeComponentVisibility } from '../actions/controlActions';

const mapStateToProps = (state: AppState) => {
    return {
        componentVisibility: state.controlState.componentVisibility,
    }
};

const mapDispatchToProps = {
    changeComponentVisibility,
};


export default connect(mapStateToProps, mapDispatchToProps)(ControlPanelList);
