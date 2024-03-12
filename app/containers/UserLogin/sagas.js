import {
  takeLatest, put, take, cancel,
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { authenticate, authenticateWithAzure } from 'containers/App/actions';

import { LOGIN, LOGIN_WITH_AZURE } from './constants';

export function* loginSaga({ data }) {
  yield put(authenticate(data));
}
export function* loginWithAzureSaga() {
  yield put(authenticateWithAzure());
}

export function* defaultSaga() {
  const watcher = yield takeLatest(LOGIN, loginSaga);
  const watcherAzure = yield takeLatest(LOGIN_WITH_AZURE, loginWithAzureSaga);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
  yield cancel(watcherAzure);
}

export default [
  defaultSaga,
];
