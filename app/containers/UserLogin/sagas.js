import { takeLatest, put, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { browserHistory } from 'react-router';

import { authenticate } from 'containers/App/actions';

import { LOGIN } from './constants';

export function* login({ data }) {
  yield put(authenticate(data));
  // TODO wait with redirect for authenticate success or better maybe set redirect path?
  yield browserHistory.push('/');
}

export function* defaultSaga() {
  const watcher = yield takeLatest(LOGIN, login);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  defaultSaga,
];
