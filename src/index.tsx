/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2019-2024 by the xcube development team and contributors.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import * as Redux from "redux";
import { Action, Dispatch } from "redux";
import * as ReduxLogger from "redux-logger";
import thunk from "redux-thunk";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import "./index.css";

import App from "@/connected/App";
import { Config } from "@/config";
import { changeLocale } from "@/actions/controlActions";
import { syncWithServer } from "@/actions/dataActions";
import { appReducer } from "@/reducers/appReducer";

Config.load().then(() => {
  const logger = ReduxLogger.createLogger({ collapsed: true, diff: false });
  const middlewares = Redux.applyMiddleware(thunk, logger as Redux.Middleware);
  const store = Redux.createStore(appReducer, middlewares);

  const dispatch: Dispatch = store.dispatch;

  dispatch(changeLocale(store.getState().controlState.locale));

  if (store.getState().controlState.privacyNoticeAccepted) {
    dispatch(syncWithServer() as unknown as Action);
  }

  ReactDOM.render(
    <Provider store={store}>{<App />}</Provider>,
    document.getElementById("root") as HTMLElement,
  );
});
