import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import UserPlacesDialog from '../components/UserPlacesDialog';
import { closeDialog, updateSettings } from '../actions/controlActions';
import { addUserPlacesFromText } from '../actions/dataActions';


const mapStateToProps = (state: AppState) => {
    return {
        open: !!state.controlState.dialogOpen['addUserPlacesFromText'],
        userPlacesFormatName: state.controlState.userPlacesFormatName,
        userPlacesFormatOptions: state.controlState.userPlacesFormatOptions,
    };
};

const mapDispatchToProps = {
    closeDialog,
    updateSettings,
    addUserPlacesFromText: addUserPlacesFromText,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserPlacesDialog);
