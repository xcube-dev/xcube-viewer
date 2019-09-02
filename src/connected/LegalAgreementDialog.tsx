import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import LegalAgreementDialog from '../components/LegalAgreementDialog';
import { updateSettings } from '../actions/controlActions';

const mapStateToProps = (state: AppState) => {
    return {
        open: !state.controlState.legalAgreementAccepted,
        settings: state.controlState,
    };
};

const mapDispatchToProps = {
    updateSettings,
};

export default connect(mapStateToProps, mapDispatchToProps)(LegalAgreementDialog);
