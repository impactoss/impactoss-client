/**
 * app.js
 *
 * This is the entry file for the application, only setup and boilerplate
 * code.
 */

// Needed for redux-saga es6 generator support
import 'core-js/stable';
import 'regenerator-runtime/runtime';

// Import all the third party stuff
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserHistory } from 'history';

import 'sanitize.css/sanitize.css';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

// Import ThemeProvider
import { Grommet } from 'grommet';
import theme from 'themes/theme-nz';

// Load the favicon, and the .htaccess file
/* eslint-disable import/no-unresolved, import/extensions */
import '!file-loader?name=[name].[ext]!./favicon.ico';
import '!file-loader?name=[name].[ext]!./favicon-16x16.png';
import '!file-loader?name=[name].[ext]!./favicon-32x32.png';
import '!file-loader?name=[name].[ext]!./android-chrome-192x192.png';
import '!file-loader?name=[name].[ext]!./android-chrome-256x256.png';
import '!file-loader?name=[name].[ext]!./mstile-150x150.png';
import '!file-loader?name=[name].[ext]!./apple-touch-icon.png';
import '!file-loader?name=[name].[ext]!./safari-pinned-tab.svg';
import 'file-loader?name=[name].[ext]!./.htaccess';
/* eslint-enable import/no-unresolved, import/extensions */

import createStore from './store';

// Import i18n messages
import { translationMessages } from './i18n';

// Import root routes
import { Routes } from './routes';

const container = document.getElementById('app');
const root = createRoot(container);

/*
history-first-redux

import { HistoryRouter as Router } from "redux-first-history/rr6";
import { createBrowserHistory } from 'history';
import { createReduxHistoryContext } from "redux-first-history";


export const {
  routerReducer,
  routerMiddleware,
  createReduxHistory
} = createReduxHistoryContext({ history: browserHistory, selectRouterState: state => state.get("router") });

const history = createReduxHistory(store);

<Router history={history}></Router>
*/
const browserHistory = createBrowserHistory();
const store = createStore(browserHistory);

const render = (messages) => {
  root.render(       
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <Grommet theme={theme}>
          <Routes store={store} />
        </Grommet>
      </LanguageProvider>
    </Provider>
  );
};

// Hot reloadable translation json files
if (module.hot) {
  // modules.hot.accept does not accept dynamic dependencies,
  // have to be constants at compile-time
  module.hot.accept('./i18n', () => {
    render(translationMessages);
  });
}

// Chunked polyfill for browsers without Intl support
/* eslint-disable import/extensions */
if (!window.Intl) {
  new Promise((resolve) => {
    resolve(import('intl'));
  })
    .then(() => Promise.all([import('intl/locale-data/jsonp/en.js')]))
    .then(() => render(translationMessages))
    .catch((err) => {
      throw err;
    });
} else {
  render(translationMessages);
}

// Install ServiceWorker and AppCache in the end since
// it's not most important operation and if main code fails,
// we do not want it installed
if (process.env.NODE_ENV === 'production') {
  const runtime = require('offline-plugin/runtime'); // eslint-disable-line global-require
  runtime.install({
    onUpdateReady: () => {
      // console.log('SW Event:', 'onUpdateReady');
      // Tells to new SW to take control immediately
      runtime.applyUpdate();
    },
  });
}
