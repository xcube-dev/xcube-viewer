import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import ServerDialog from '../components/ServerDialog';
import { closeDialog } from "../actions/controlActions";
import { configureServers } from "../actions/dataActions";
import { selectedServerSelector } from "../selectors/controlSelectors";
import { userServersSelector } from "../selectors/dataSelectors";


const mapStateToProps = (state: AppState) => {
    return {
        open: !!state.controlState.dialogOpen["server"],
        servers: userServersSelector(state),
        selectedServer: selectedServerSelector(state),
    };
};

const mapDispatchToProps = {
    closeDialog,
    configureServers,
};

export default connect(mapStateToProps, mapDispatchToProps)(ServerDialog);
