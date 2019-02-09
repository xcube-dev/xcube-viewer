import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Viewer from './Viewer';

it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Viewer/>, div);
    ReactDOM.unmountComponentAtNode(div);
});
