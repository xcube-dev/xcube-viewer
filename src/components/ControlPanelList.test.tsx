import * as React from 'react';
import ControlPanelList from './ControlPanelList';
import { ComponentVisibility } from '../states/controlState';
import * as ReactDOM from 'react-dom';


it('renders without crashing', () => {
    const componentVisibility: ComponentVisibility = {
        sideMenu: true,
        datasetList: false,
        layerList: true,
        regionList: false,
        timePanel: false,
        timeSeriesPanel: true,
    };
    const div = document.createElement('div');
    ReactDOM.render(<ControlPanelList componentVisibility={componentVisibility}
                                      changeComponentVisibility={() => null}/>, div);
    ReactDOM.unmountComponentAtNode(div);
});

