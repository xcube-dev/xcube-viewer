import * as React from 'react';
import { Provider } from 'react-redux';
import * as ReactDOM from 'react-dom';
import * as Redux from 'redux';
import thunk from 'redux-thunk';
import * as ReduxLogger from 'redux-logger';

import { appReducer } from './reducers/appReducer';
import { updateDatasets, updateColorBars, updateServerInfo } from './actions/dataActions';
import { changeLocale } from "./actions/controlActions";
import App from './connected/App';
import * as serviceWorker from './serviceWorker';
import { getCurrentLocale } from "./util/lang";
import { I18N } from "./config";
import { getGlobalCanvasImageSmoothing, setGlobalCanvasImageSmoothing } from './util/hacks';
import { Auth0Provider, getAuth0Config } from "./components/Auth0Provider";
import history from './util/history';

import './index.css';

// A function that routes the user to the right place
// after login
const onRedirectCallback = (appState: any) => {
    history.push(
        appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    );
};

I18N.locale = getCurrentLocale();

const logger = ReduxLogger.createLogger({collapsed: true, diff: false});
const store = Redux.createStore(appReducer, Redux.applyMiddleware(thunk, logger));

if (store.getState().controlState.imageSmoothingEnabled !== getGlobalCanvasImageSmoothing()) {
    setGlobalCanvasImageSmoothing(store.getState().controlState.imageSmoothingEnabled);
}

store.dispatch(changeLocale(I18N.locale) as any);
store.dispatch(updateServerInfo() as any);
store.dispatch(updateDatasets() as any);
store.dispatch(updateColorBars() as any);

let app = <App/>;

const auth0Config = getAuth0Config();
if (auth0Config !== null) {
    app = (
        <Auth0Provider
            domain={auth0Config.domain}
            client_id={auth0Config.clientId}
            audience={auth0Config.audience}
            redirect_uri={window.location.origin}
            onRedirectCallback={onRedirectCallback}
        >
            {app}
        </Auth0Provider>
    );
}

ReactDOM.render(
    <Provider store={store}>{app}</Provider>,
    document.getElementById('root') as HTMLElement
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
