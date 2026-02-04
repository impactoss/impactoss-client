import {
  takeLatest, put, take, cancel,
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { authenticate, authenticateWithAzure, recoverPassword } from 'containers/App/actions';

import { LOGIN, LOGIN_WITH_AZURE, RECOVER } from './constants';

export function* loginSaga({ data }) {
  yield put(authenticate(data));
}

export function* recoverSaga({ data }) {
  yield put(recoverPassword(data));
}

export function* loginWithAzureSaga() {
  yield put(authenticateWithAzure());
}

export function* defaultSaga() {
  const watcher = yield takeLatest(LOGIN, loginSaga);
  const watcherAzure = yield takeLatest(LOGIN_WITH_AZURE, loginWithAzureSaga);
  const watcherRecover = yield takeLatest(RECOVER, recoverSaga);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
  yield cancel(watcherAzure);
  yield cancel(watcherRecover);
}

export default [
  defaultSaga,
];
