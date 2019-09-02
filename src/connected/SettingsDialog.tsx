import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import SettingsDialog from '../components/SettingsDialog';
import { changeLocale, closeDialog, openDialog, updateSettings } from '../actions/controlActions';
import { selectedServerSelector } from "../selectors/controlSelectors";

const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        open: state.controlState.dialogOpen['settings'],
        settings: state.controlState,
        selectedServer: selectedServerSelector(state),
    };
};

const mapDispatchToProps = {
    closeDialog,
    updateSettings,
    changeLocale,
    openDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog);
