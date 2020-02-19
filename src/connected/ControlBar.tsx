import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import ControlBar from '../components/ControlBar';
import { WithLocale } from '../util/lang';
import DatasetSelect from './DatasetSelect';
import VariableSelect from './VariableSelect';
import RgbSwitch from './RgbSwitch';
import PlaceGroupsSelect from './PlaceGroupsSelect';
import PlaceSelect from './PlaceSelect';
import MapInteractionsBar from './MapInteractionsBar';
import TimeSelect from './TimeSelect';
import TimeSlider from './TimeSlider';
import TimePlayer from './TimePlayer';
import ControlBarActions from './ControlBarActions';

interface ControlBarProps extends WithLocale {
    show: boolean;
}

const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        show: state.dataState.datasets.length > 0,
    };
};

const mapDispatchToProps = {};

const _ControlBar: React.FC<ControlBarProps> = (props) => {
    if (!props.show) {
        return null;
    }
    return (
        <ControlBar>
            <DatasetSelect/>
            <VariableSelect/>
            <RgbSwitch/>
            <PlaceGroupsSelect/>
            <PlaceSelect/>
            <MapInteractionsBar/>
            <TimeSelect/>
            <TimePlayer/>
            <TimeSlider/>
            <ControlBarActions/>
        </ControlBar>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(_ControlBar);
