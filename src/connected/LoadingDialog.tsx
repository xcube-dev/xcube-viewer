import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import LoadingDialog from "../components/LoadingDialog";
import { activityMessagesSelector } from "../selectors/controlSelectors";


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        messages: activityMessagesSelector(state),
    };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LoadingDialog);
