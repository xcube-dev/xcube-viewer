import { connect } from 'react-redux';

import PlaceGroupsSelect from "../components/PlaceGroupsSelect";
import { AppState } from '../states/appState';
import { selectPlaceGroups } from '../actions/controlActions';
import {
    selectedDatasetPlaceGroupsSelector,
    selectedDatasetSelectedPlaceGroupsTitleSelector
} from '../selectors/controlSelectors';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,

        datasets: state.dataState.datasets,

        selectedPlaceGroupIds: state.controlState.selectedPlaceGroupIds,
        placeGroups: selectedDatasetPlaceGroupsSelector(state),
        selectedPlaceGroupsTitle: selectedDatasetSelectedPlaceGroupsTitleSelector(state),
    };
};

const mapDispatchToProps = {
    selectPlaceGroups,
};

export default connect(mapStateToProps, mapDispatchToProps)(PlaceGroupsSelect);
