import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import MessageLog from '../components/MessageLog';
import { hideMessage } from '../actions/messageLogActions';


const mapStateToProps = (state: AppState) => {
    let newEntries = state.messageLogState.newEntries;
    return {
        locale: state.controlState.locale,
        message: newEntries.length > 0 ? newEntries[0] : null,
    };
};

const mapDispatchToProps = {
    hideMessage,
};

export default connect(mapStateToProps, mapDispatchToProps)(MessageLog);
