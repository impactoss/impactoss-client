import { takeLatest, put, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { recoverPassword } from 'containers/App/actions';

import { RECOVER } from './constants';

export function* recover({ data }) {
  yield put(recoverPassword(data));
}

export function* defaultSaga() {
  const watcher = yield takeLatest(RECOVER, recover);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  defaultSaga,
];
