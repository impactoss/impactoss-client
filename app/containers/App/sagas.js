/**
 * Gets the entities from server
 */

import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';
import {
    LOAD_ENTITIES_IF_NEEDED,
    LOAD_ENTITIES,
    AUTHENTICATE,
    LOGOUT,
} from 'containers/App/constants';
import {
    loadEntities,
    entitiesLoaded,
    entitiesLoadingError,
    authenticateSuccess,
    authenticateSending,
    authenticateError,
    logoutSuccess,
} from 'containers/App/actions';

import { makeSelectEntities } from 'containers/App/selectors';

import apiRequest from 'utils/api-request';

/**
 * Check if entities already present
 */
export function* checkEntitiesSaga(payload) {
  // select entities from store
  const entities = yield select(makeSelectEntities(payload.path));

  // console.log('checking entities', entities);

  // TODO add other checks here, eg if user or user role changed (not sure how) to ensure we also get the DRAFT posts
  //    easiest would be to just set entities to false on login thus triggering a reload
  if (!entities) {
    yield put(loadEntities(payload.path));
  }
}

/**
 * Server API request/response handler
 */
export function* getEntitiesSaga(payload) {
  try {
    const serverPath = payload.path.replace('action', 'measure');

    // console.log('getting ',serverPath);

    const response = yield call(apiRequest, 'get', serverPath);

    // console.log('got ', response);

    yield put(entitiesLoaded(response.data, payload.path));
  } catch (err) {
    // console.error(err);
    yield put(entitiesLoadingError(err));
  }
}

export function* authenticateSaga(payload) {
  const { password, email } = payload.data;

  yield put(authenticateSending());

  try {
    const response = yield call(apiRequest, 'post', 'auth/sign_in', { email, password });

    yield put(authenticateSuccess(response.data));
  } catch (err) {
    err.response.json = yield err.response.json();
    yield put(authenticateError(err));
  }
}

export function* logoutSaga() {
  try {
    yield call(apiRequest, 'delete', 'auth/sign_out');

    yield put(logoutSuccess());
  } catch (err) {
      // TODO ensure this is displayed
    yield put(authenticateError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* rootSaga() {
  // console.log('calling rootSaga');
  yield takeEvery(LOAD_ENTITIES_IF_NEEDED, checkEntitiesSaga);

  // Watches for LOAD_ENTITIES entities and calls getEntities when one comes in.
  // It returns task descriptor (just like fork) so we can continue execution
  yield takeEvery(LOAD_ENTITIES, getEntitiesSaga);
  yield takeLatest(AUTHENTICATE, authenticateSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}
