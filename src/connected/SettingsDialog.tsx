import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import SettingsDialog from '../components/SettingsDialog';
import { closeDialog } from '../actions/controlActions';

const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        open: state.controlState.dialogOpen['settings'],
        scroll: 'body',
    };
};

const mapDispatchToProps = {
    closeDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog);
