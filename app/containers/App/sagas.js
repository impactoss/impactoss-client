/**
 * Gets the entities from server
 */

import { take, call, put, select, cancel, takeLatest, takeEvery  } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { LOAD_ENTITIES, LOAD_ENTITIES_IF_NEEDED } from 'containers/App/constants';
import { loadEntities, entitiesLoaded, entitiesLoadingError } from 'containers/App/actions';

import { makeSelectEntities } from 'containers/App/selectors';

import request from 'utils/request';

/**
 * Check if entities already present
 */
export function* checkEntities(payload) {
  // select entities from store
  const entities = yield select(makeSelectEntities(payload.path));
  
  // TODO add other checks here, eg if user or user role changed (not sure how) to ensure we also get the DRAFT posts
  //    easiest would be to just set entities to false on login thus triggering a reload
  if (!entities) {
    yield put(loadEntities(payload.path));
  } 
}

/**
 * Server API request/response handler
 */
export function* getEntities(payload) {
  
  // TODO set server URL in config
  // TODO map "path" elsewhere, maybe in /utils?
  const requestURL = 'https://undp-sadata-staging.herokuapp.com/' + payload.path.replace('action','measure');

  try {
    // Call our request helper (see 'utils/request')
    const entitiesData = yield call(request, requestURL);
    yield put(entitiesLoaded(entitiesData.data, payload.path));
  } catch (err) {
    yield put(entitiesLoadingError(err));
  }

}

/**
 * Root saga manages watcher lifecycle
 */
export function* serverData() {
  yield takeLatest(LOAD_ENTITIES_IF_NEEDED, checkEntities);
  
  // Watches for LOAD_ENTITIES entities and calls getEntities when one comes in.
  // It returns task descriptor (just like fork) so we can continue execution  
  const watcher = yield takeEvery(LOAD_ENTITIES, getEntities);

  // Suspend execution until location changes
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// Bootstrap sagas
export default [
  serverData,
];
