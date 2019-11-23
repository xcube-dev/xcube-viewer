import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import {
    baseMapLayerSelector,
    selectedDatasetPlaceGroupLayersSelector,
    selectedDatasetVariableLayerSelector, selectedPlaceGroupPlacesSelector
} from '../selectors/controlSelectors';
import { addUserPlace } from '../actions/dataActions';
import Viewer from '../components/Viewer';
import { userPlaceGroupSelector } from "../selectors/dataSelectors";
import { selectPlace } from "../actions/controlActions";
import ColorBarLegend from "./ColorBarLegend";


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        variableLayer: selectedDatasetVariableLayerSelector(state),
        placeGroupLayers: selectedDatasetPlaceGroupLayersSelector(state),
        colorBarLegend: <ColorBarLegend/>,
        userPlaceGroup: userPlaceGroupSelector(state),
        mapInteraction: state.controlState.mapInteraction,
        flyTo: state.controlState.flyTo,
        selectedPlaceId: state.controlState.selectedPlaceId,
        places: selectedPlaceGroupPlacesSelector(state),
        baseMapLayer: baseMapLayerSelector(state),
    }
};

const mapDispatchToProps = {
    addUserPlace,
    selectPlace,
};

export default connect(mapStateToProps, mapDispatchToProps)(Viewer);
