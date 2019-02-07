import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Viewer from './Viewer';
import registerServiceWorker from './registerServiceWorker';

import './index.css';


ReactDOM.render(
    <Viewer/>,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();
