/**
 * Gets the entities from server
 */

import { take, call, put, select, cancel, takeLatest, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import {
  LOAD_ENTITIES,
  LOAD_ENTITIES_SUCCESS,
  LOAD_ENTITIES_IF_NEEDED,
  AUTHENTICATE,
  AUTHENTICATE_SUCCESS,
  LOGOUT,
  LOGOUT_SUCCESS,
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
import {
  makeSelectEmail,
  makeSelectPassword,
} from 'containers/App/selectors';

import { makeSelectEntities } from 'containers/App/selectors';
import extend from 'lodash/extend';

import request from 'utils/request';
import { updateAuthHeaders, getAuthHeaders, destroySession } from 'utils/session-storage';
import { parseResponse } from 'utils/handle-request-response';


/**
 * Check if entities already present
 */
export function* checkEntitiesSaga(payload) {
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
export function* getEntitiesSaga(payload) {
  // TODO set server URL in config
  // TODO map "path" elsewhere, maybe in /utils?
  const requestURL = `https://undp-sadata-staging.herokuapp.com/${payload.path.replace('action', 'measure')}`;

  // TODO get auth headers
  const options = {};
  options.headers = {};
  extend(options.headers, getAuthHeaders());
  try {
    // Call our request helper (see 'utils/request')

    const response = yield call(request, requestURL, options);

    const headers = yield response.headers;
    const entities = yield response.json();

    yield put(entitiesLoaded(entities, payload.path, headers));
  } catch (err) {
    yield put(entitiesLoadingError(err));
  }
}
export function* authenticateSaga(payload) {

  const requestURL = 'https://undp-sadata-staging.herokuapp.com/auth/sign_in';
  const { password, email } = payload.data;

  console.log(password)

  yield put(authenticateSending());
  try {
    // Call our request helper (see 'utils/request')

    // yield call(api, 'post', {email, password})
    const response = yield call(request, requestURL, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'post',
      body: JSON.stringify({ email, password }),
    });

    const headers = yield response.headers;
    const user = yield response.json();
    yield put(authenticateSuccess(user, headers));
//    })
  } catch (err) {
    yield put(authenticateError(err));
  }
}
export function* logoutSaga() {
  // TODO set server URL in config
  const requestURL = 'https://undp-sadata-staging.herokuapp.com/auth/sign_out';
  // TODO get auth headers
  const options = {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'delete',
  };
  extend(options.headers, getAuthHeaders());
  try {
    // Call our request helper (see 'utils/request')


    yield call(request, requestURL, options);

    yield put(logoutSuccess());
//    })
  } catch (err) {
    // yield put(authenticateError(err));
  }
}
export function* logoutSuccessSaga(payload) {
 // persist headers for next request
  destroySession();
}
export function* authenticateSuccessSaga(payload) {
 // persist headers for next request
  updateAuthHeaders(payload.headers);
}
export function* getEntitiesSuccessSaga(payload) {
 // persist headers for next request
  updateAuthHeaders(payload.headers);
}

/**
 * Root saga manages watcher lifecycle
 */
export function* rootSaga() {
  yield takeEvery(LOAD_ENTITIES_IF_NEEDED, checkEntitiesSaga);

  // Watches for LOAD_ENTITIES entities and calls getEntities when one comes in.
  // It returns task descriptor (just like fork) so we can continue execution
  yield takeEvery(LOAD_ENTITIES, getEntitiesSaga);
  yield takeLatest(AUTHENTICATE, authenticateSaga);
  yield takeLatest(LOGOUT, logoutSaga);

  yield takeLatest(AUTHENTICATE_SUCCESS, authenticateSuccessSaga);
  yield takeLatest(LOAD_ENTITIES_SUCCESS, getEntitiesSuccessSaga);
  yield takeLatest(LOGOUT_SUCCESS, logoutSuccessSaga);
}

// Bootstrap sagas
export default [
  rootSaga,
];
