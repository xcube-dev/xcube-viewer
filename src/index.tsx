import * as React from 'react';
import { Provider } from 'react-redux';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import thunk from 'redux-thunk';
import * as ReduxLogger from 'redux-logger';
import { appReducer } from './reducers/appReducer';
import { updateDatasets, updateColorBars } from './actions/dataActions';
import { changeLocale } from "./actions/controlActions";
import App from './connected/App';
import registerServiceWorker from './registerServiceWorker';
import { I18N } from "./config";

import './index.css';

const logger = ReduxLogger.createLogger({collapsed: true, diff: false});
const store = Redux.createStore(appReducer, Redux.applyMiddleware(thunk, logger));

store.dispatch(changeLocale(I18N.locale) as any);
store.dispatch(updateDatasets() as any);
store.dispatch(updateColorBars() as any);

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root') as HTMLElement
);

registerServiceWorker();
