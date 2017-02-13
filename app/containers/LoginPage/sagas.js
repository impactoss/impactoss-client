import { takeLatest, put, select, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { authenticate } from 'containers/App/actions';
import { SUBMIT_FORM } from './constants';
import { credentialsSelector } from './selectors';

export function* doLogin() {
  const credentials = yield select(credentialsSelector);
  yield put(authenticate(credentials));
}

export function* loginSaga() {
  const watcher = yield takeLatest(SUBMIT_FORM, doLogin);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  loginSaga,
];
