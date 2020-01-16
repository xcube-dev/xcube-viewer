import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import ControlBar from '../components/ControlBar';
import DatasetSelect from './DatasetSelect';
import VariableSelect from './VariableSelect';
import PlaceGroupsSelect from './PlaceGroupsSelect';
import PlaceSelect from './PlaceSelect';
import MapInteractionsBar from './MapInteractionsBar';
import TimeSelect from './TimeSelect';
import TimeSlider from './TimeSlider';
import TimePlayer from './TimePlayer';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
    };
};

const mapDispatchToProps = {};

const _ControlBar: React.FC = () => {
    return (
        <ControlBar>
            <DatasetSelect/>
            <VariableSelect/>
            <PlaceGroupsSelect/>
            <PlaceSelect/>
            <MapInteractionsBar/>
            <TimeSelect/>
            <TimePlayer/>
            <TimeSlider/>
        </ControlBar>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(_ControlBar);
