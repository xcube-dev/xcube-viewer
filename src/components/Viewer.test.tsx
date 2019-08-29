import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Viewer from './Viewer';


it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Viewer userPlaceGroup={{type: 'FeatureCollection', id: 'user', title: '', features: []}}/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
