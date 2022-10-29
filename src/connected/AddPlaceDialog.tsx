import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import AddPlaceDialog from '../components/AddPlaceDialog';
import { closeDialog } from '../actions/controlActions';
import { addUserPlacesFromText } from '../actions/dataActions';


const mapStateToProps = (state: AppState) => {
    return {
        open: !!state.controlState.dialogOpen['addUserPlaceFromText'],
        placeLabelPropertyName: state.controlState.placeLabelPropertyName,
        placeLabelPrefix: state.controlState.placeLabelPrefix,
    };
};

const mapDispatchToProps = {
    closeDialog,
    addUserPlacesFromText: addUserPlacesFromText,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddPlaceDialog);
