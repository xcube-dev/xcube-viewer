import * as React from 'react';
import { Provider } from 'react-redux';
import * as ReactDOM from 'react-dom';
import * as Redux from "redux";
import thunk from 'redux-thunk';
import * as ReduxLogger from 'redux-logger';
import { viewerReducer } from './reducers/viewerReducer';
import { updateDatasets } from "./actions/dataActions";
// import Viewer from './components/Viewer';
import Dashboard from "./components/Dashboard";
import registerServiceWorker from './registerServiceWorker';

import './index.css';

const logger = ReduxLogger.createLogger({collapsed: true});
const store = Redux.createStore(viewerReducer, Redux.applyMiddleware(thunk, logger));
store.dispatch(updateDatasets() as any);

ReactDOM.render(
    <Provider store={store}>
        <Dashboard/>
    </Provider>,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();
