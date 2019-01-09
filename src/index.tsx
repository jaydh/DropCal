import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import * as serviceWorker from "./serviceWorker";
import createSagaMiddleware from "redux-saga";
import reducer from "./reducers";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import appReducer from "./reducers/index";
import files from "./sagas/files";
import upload from "./sagas/upload";

const sagaMiddleware = createSagaMiddleware();

export const store = createStore(
  appReducer,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);
sagaMiddleware.run(files);
sagaMiddleware.run(upload);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

serviceWorker.unregister();
