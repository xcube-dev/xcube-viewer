/*
 * Copyright (c) 2019-2025 by xcube team and contributors
 * Permissions are hereby granted under the terms of the MIT License:
 * https://opensource.org/licenses/MIT.
 */

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import * as Redux from "redux";
import { Action, Dispatch } from "redux";
import * as ReduxLogger from "redux-logger";
import thunk from "redux-thunk";

import "@fontsource/material-icons";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";

import App from "@/connected/App";
import { Config } from "@/config";
import {
  changeLocale,
  SET_VARIABLE_SPLIT_POS,
  updateUserColorBarsImageData,
} from "@/actions/controlActions";
import { syncWithServer } from "@/actions/dataActions";
import { appReducer } from "@/reducers/appReducer";
import { AppState } from "@/states/appState";
import baseUrl from "@/util/baseurl";

console.debug("baseUrl:", baseUrl);

Config.load().then(() => {
  const actionFilter = (_getState: () => AppState, action: Action) =>
    action.type !== SET_VARIABLE_SPLIT_POS;
  const logger = ReduxLogger.createLogger({
    collapsed: true,
    diff: false,
    predicate: actionFilter,
  });
  const middlewares = Redux.applyMiddleware(thunk, logger as Redux.Middleware);
  const store = Redux.createStore(appReducer, middlewares);

  const dispatch: Dispatch = store.dispatch;

  dispatch(changeLocale(store.getState().controlState.locale));
  dispatch(updateUserColorBarsImageData() as unknown as Action);
  if (store.getState().controlState.privacyNoticeAccepted) {
    dispatch(syncWithServer(store, true) as unknown as Action);
  }

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <Provider store={store}>{<App />}</Provider>,
  );
});
