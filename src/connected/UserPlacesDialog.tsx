import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import UserPlacesDialog from '../components/UserPlacesDialog';
import { closeDialog, updateSettings, setMapInteraction } from '../actions/controlActions';
import { addUserPlacesFromText } from '../actions/dataActions';


const mapStateToProps = (state: AppState) => {
    return {
        open: !!state.controlState.dialogOpen['addUserPlacesFromText'],
        userPlacesFormatName: state.controlState.userPlacesFormatName,
        userPlacesFormatOptions: state.controlState.userPlacesFormatOptions,
        nextMapInteraction: state.controlState.lastMapInteraction,
    };
};

const mapDispatchToProps = {
    closeDialog,
    updateSettings,
    setMapInteraction,
    addUserPlacesFromText,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPlacesDialog);
