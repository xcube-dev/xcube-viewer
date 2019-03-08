import * as React from 'react';
import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import ControlBar from '../components/ControlBar';
import DatasetSelect from './DatasetSelect';
import VariableSelect from './VariableSelect';
import PlaceGroupsSelect from './PlaceGroupsSelect';
import PlaceSelect from './PlaceSelect';
import TimeSelect from './TimeSelect';
import TimeSlider from './TimeSlider';
import TimeSeriesModeSelect from './TimeSeriesModeSelect';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
    };
};

const mapDispatchToProps = {};

class _ControlBar extends React.Component {
    render() {
        return (
            <ControlBar>
                <DatasetSelect/>
                <VariableSelect/>
                <PlaceGroupsSelect/>
                <PlaceSelect/>
                <TimeSelect/>
                <TimeSlider/>
                <TimeSeriesModeSelect/>
            </ControlBar>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(_ControlBar);
