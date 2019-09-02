import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import AddPlaceDialog from '../components/AddPlaceDialog';
import { closeDialog } from '../actions/controlActions';
import { addUserPlaceFromText } from '../actions/dataActions';


const mapStateToProps = (state: AppState) => {
    return {
        open: !!state.controlState.dialogOpen['addUserPlaceFromText'],
    };
};

const mapDispatchToProps = {
    closeDialog,
    addUserPlaceFromText,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPlaceDialog);
