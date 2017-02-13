import { takeLatest, put, select, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { authenticate } from 'containers/App/actions';
import { SUBMIT_FORM } from './constants';
import { registerCredentialsSelector } from './selectors';

export function* doRegister() {
  const credentials = yield select(registerCredentialsSelector);
  yield put(authenticate(credentials));
}

export function* registerSaga() {
  const watcher = yield takeLatest(SUBMIT_FORM, doRegister);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  registerSaga,
];
