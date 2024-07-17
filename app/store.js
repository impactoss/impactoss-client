/**
 * Create the store with asynchronously loaded reducers
 */
import { configureStore } from '@reduxjs/toolkit';
import { fromJS } from 'immutable';
import createSagaMiddleware from 'redux-saga';

import appSaga from 'containers/App/sagas';
import entityListSaga from 'containers/EntityList/sagas';
import entityListFormSaga from 'containers/EntityListForm/sagas';
import createReducer from './reducers';

export default function createStore(browserHistory) {
  // Create the store with two middlewares
  // 1. sagaMiddleware: Makes redux-sagas work
  // 2. routerMiddleware: Syncs the location/URL path to the state
  const sagaMiddleware = createSagaMiddleware();
  const store = configureStore({
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false, serializableCheck: false })
        .concat(sagaMiddleware),
    //.concat(sagaMiddleware,routeReducer)
    //reducer: createReducer(browserHistory),
    reducer: createReducer(),
    preloadedState: fromJS({}),
    devTools: process.env.NODE_ENV !== 'production',
  });

  // Extensions
  // Load app level sagas ( https://github.com/mxstbr/react-boilerplate/issues/1077 )

  sagaMiddleware.run(appSaga, { history: browserHistory });
  //sagaMiddleware.run(appSaga);
  sagaMiddleware.run(entityListSaga);
  sagaMiddleware.run(entityListFormSaga);

  store.runSaga = sagaMiddleware.run;
  store.asyncReducers = {}; // Async reducer registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      import('./reducers').then((reducerModule) => {
        const createReducers = reducerModule.default;
        const nextReducers = createReducers(store.asyncReducers);

        store.replaceReducer(nextReducers);
      });
    });
  }

  return store;
}
