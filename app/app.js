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
import { Router, browserHistory } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

// Import ThemeProvider
import { Grommet } from 'grommet';

import { StyleSheetManager } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';

import 'sanitize.css/sanitize.css';

// Import root app
import App from 'containers/App';

// Import selector for `syncHistoryWithStore`
import { makeSelectLocationState } from 'containers/App/selectors';

// Import Language Provider
import LanguageProvider from 'containers/LanguageProvider';

import theme from 'themes/theme-base';
import './fonts/fonts.css';

import configureStore from './store';

// Import i18n messages
import { translationMessages } from './i18n';

// Import root routes
import createRoutes from './routes';

// Create redux store with history
// this uses the singleton browserHistory provided by react-router
// Optionally, this could be changed to leverage a created history
// e.g. `const browserHistory = useRouterHistory(createBrowserHistory)();`
const initialState = {};
const store = configureStore(initialState, browserHistory);

// Sync history and store, as the react-router-redux reducer
// is under the non-default key ("routing"), selectLocationState
// must be provided for resolving how to retrieve the "route" in the state
const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: makeSelectLocationState(),
});

// Set up the router, wrapping all Routes in the App component
const rootRoute = {
  component: App,
  childRoutes: createRoutes(store),
};

const container = document.getElementById('app');
const root = createRoot(container);
const render = (messages) => {
  root.render(
    <Provider store={store}>
      <LanguageProvider messages={messages}>
        <StyleSheetManager
          enableVendorPrefixes
          shouldForwardProp={(propName, target) => {
            if (typeof target === "string") {
              // For HTML elements, forward the prop if it is a valid HTML attribute
              return isPropValid(propName);
            }
            // For other elements, forward all props
            return true;
          }}
        >
          <Grommet theme={theme}>
            <Router
              history={history}
              routes={rootRoute}
            />
          </Grommet>
        </StyleSheetManager>
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
/*
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
}*/
