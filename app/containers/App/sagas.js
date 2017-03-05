/**
 * Gets the entities from server
 */

import { call, put, select, takeLatest, takeEvery, take } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import collection from 'lodash/collection';

import {
    LOAD_ENTITIES_IF_NEEDED,
    AUTHENTICATE,
    AUTHENTICATE_SUCCESS,
    LOGOUT,
    VALIDATE_TOKEN,
    ENTITIES_READY,
    FIND_ENTITY,
} from 'containers/App/constants';
import {
    loadingEntities,
    entitiesLoaded,
    entitiesLoadingError,
    authenticateSuccess,
    authenticateSending,
    authenticateError,
    logoutSuccess,
    logout,
    entitiesRequested,
    entitiesReady,
    loadEntitiesIfNeeded,
    entityNotFound,
} from 'containers/App/actions';

import {
  makeSelectNextPathname,
  requestedSelector,
  haveEntitySelector,
} from 'containers/App/selectors';

import apiRequest, { getAuthValues, clearAuthValues } from 'utils/api-request';

export function* findEntitySaga({ path, id }) {
  let found = yield select(haveEntitySelector, { path, id });
  if (!found) {
    yield put(loadEntitiesIfNeeded(path));
    // Execution will wait at this take until Entities are loaded
    // if they already have been fetched this will take quickly, otherwise it will take as soon as we hear back from the api
    yield take(ENTITIES_READY[path]);

    found = yield select(haveEntitySelector, { path, id });
    if (!found) {
      // Handle error case, where action can't be found
      yield put(entityNotFound({ path, id }));
    }
  }
}

/**
 * Check if entities already present
 */
export function* checkEntitiesSaga(payload) {
  // requestedSelector returns the times that entities where fetched from the API
  const requested = yield select(requestedSelector);
  const requestedAt = requested.get(payload.path);

  // If haven't requested yet, do so now.
  if (!requestedAt) {
    // First record that we are requesting
    yield put(entitiesRequested(payload.path, Date.now()));
    // Updates the loading state of the app
    yield put(loadingEntities(payload.path));
    try {
      // Actions are called measures on the server
      const serverPath = payload.path.replace('action', 'measure');
      // Call the API
      const response = yield call(apiRequest, 'get', serverPath);
      // Save response and set loading = false
      yield put(entitiesLoaded(collection.keyBy(response.data, 'id'), payload.path));
    } catch (err) {
      // Whoops Save error
      yield put(entitiesLoadingError(err, payload.path));
      // Clear the request time on error, This will cause us to try again next time, which we probably want to do?
      yield put(entitiesRequested(payload.path, null));
    }
  }
  // Entities are ready, let listeners know
  yield put(entitiesReady(payload.path));
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

export function* authenticateSuccessSaga() {
  const nextPathName = yield select(makeSelectNextPathname());
  if (nextPathName) {
    yield put(push(nextPathName));
  }
}

export function* logoutSaga() {
  try {
    yield call(apiRequest, 'delete', 'auth/sign_out');
    yield call(clearAuthValues);
    yield put(logoutSuccess());
  } catch (err) {
    yield call(clearAuthValues);
      // TODO ensure this is displayed
    yield put(authenticateError(err));
  }
}

export function* validateTokenSaga() {
  yield put(authenticateSending());

  try {
    const { uid, client, 'access-token': accessToken } = yield getAuthValues();
    if (uid && client && accessToken) {
      const response = yield call(apiRequest, 'get', 'auth/validate_token', { uid, client, 'access-token': accessToken });
      yield put(authenticateSuccess(response.data));
    } else {
      yield put(logout());
    }
  } catch (err) {
    yield call(clearAuthValues);
    err.response.json = yield err.response.json();
    yield put(authenticateError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* rootSaga() {
  // console.log('calling rootSaga');
  yield takeEvery(VALIDATE_TOKEN, validateTokenSaga);
  yield takeEvery(LOAD_ENTITIES_IF_NEEDED, checkEntitiesSaga);
  yield takeEvery(FIND_ENTITY, findEntitySaga);

  yield takeLatest(AUTHENTICATE, authenticateSaga);
  yield takeLatest(AUTHENTICATE_SUCCESS, authenticateSuccessSaga);
  yield takeLatest(LOGOUT, logoutSaga);
}
