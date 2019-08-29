import { connect } from 'react-redux';

import PlaceGroupsSelect from "../components/PlaceGroupsSelect";
import { AppState } from '../states/appState';
import { removeAllUserPlaces } from '../actions/dataActions';
import { selectPlaceGroups } from '../actions/controlActions';
import {
    placeGroupsSelector,
    selectedPlaceGroupsTitleSelector
} from '../selectors/controlSelectors';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,

        selectedPlaceGroupIds: state.controlState.selectedPlaceGroupIds,
        placeGroups: placeGroupsSelector(state),
        selectedPlaceGroupsTitle: selectedPlaceGroupsTitleSelector(state),
    };
};

const mapDispatchToProps = {
    selectPlaceGroups,
    removeAllUserPlaces,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceGroupsSelect);
