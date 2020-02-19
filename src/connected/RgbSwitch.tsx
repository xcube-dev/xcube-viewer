import { connect } from 'react-redux';

import { AppState } from '../states/appState';
import { setRgbLayerVisibility } from '../actions/controlActions';
import { selectedDatasetRgbSchemaSelector } from '../selectors/controlSelectors';
import RgbSwitch from '../components/RgbSwitch';


const mapStateToProps = (state: AppState) => {
    return {
        locale: state.controlState.locale,
        rgbSchema: selectedDatasetRgbSchemaSelector(state),
        showRgbLayer: state.controlState.showRgbLayer,
    };
};

const mapDispatchToProps = {
    setRgbLayerVisibility,
};

export default connect(mapStateToProps, mapDispatchToProps)(RgbSwitch);
