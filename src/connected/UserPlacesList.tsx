import { connect } from 'react-redux';
import UserPlacesList from '../components/UserPlacesList';
import { AppState } from '../states/appState';
import { selectUserPlace } from '../actions/controlActions';

const mapStateToProps = (state: AppState) => {
    return {
        selectedUserPlaceId: state.controlState.selectedUserPlaceId,
        userPlaces: state.dataState.userPlaces,
    }
};

const mapDispatchToProps = {
    selectUserPlace,
};


export default connect(mapStateToProps, mapDispatchToProps)(UserPlacesList);
