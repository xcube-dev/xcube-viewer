import { connect } from 'react-redux';
import { signIn, signOut } from '../actions/userAuthActions';
import { AppState } from '../states/appState';
import { UserAuthStatus } from '../states/userAuthState';
import UserControl from '../components/UserControl';


// noinspection JSUnusedLocalSymbols
const mapStateToProps = (state: AppState) => {
    const userAuthState = state.userAuthState;
    return {
        hasAuthClient: !!userAuthState.hasAuthClient,
        isBusy: userAuthState.status === UserAuthStatus.REQUESTING_SIGN_IN || userAuthState.status === UserAuthStatus.REQUESTING_SIGN_OUT,
        idToken: userAuthState.idToken,
        accessToken: userAuthState.accessToken,
    };
};

const mapDispatchToProps = {
    signIn,
    signOut,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserControl);
