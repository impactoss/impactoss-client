import { takeLatest, put, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { resetPassword } from 'containers/App/actions';

import { RESET } from './constants';

export function* reset({ data }) {
  yield put(resetPassword(data));
}

export function* defaultSaga() {
  const watcher = yield takeLatest(RESET, reset);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  defaultSaga,
];
