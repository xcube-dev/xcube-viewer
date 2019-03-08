import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import LanguageDialog from '../components/LanguageDialog';
import { changeLocale, closeDialog } from "../actions/controlActions";


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        open: !!state.controlState.dialogOpen["language"],
    };
};

const mapDispatchToProps = {
    changeLocale,
    closeDialog,
};

export default connect(mapStateToProps, mapDispatchToProps)(LanguageDialog);
