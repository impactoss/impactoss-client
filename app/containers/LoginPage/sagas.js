import { takeLatest, put, select, take, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { authenticate } from 'containers/App/actions';
import { AUTHENTICATE_SUCCESS } from 'containers/App/constants';
import { SUBMIT_FORM } from './constants';
import { credentialsSelector } from './selectors';

export function* doLogin() {
  const credentials = yield select(credentialsSelector);
  yield put(authenticate(credentials));
}

export function* loginRedirect() {
  browserHistory.push('/');
}

export function* loginSaga() {
  const watcher = yield takeLatest(SUBMIT_FORM, doLogin);
  const redirectWatcher = yield takeLatest(AUTHENTICATE_SUCCESS, loginRedirect);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
  yield cancel(redirectWatcher);
}


export default [
  loginSaga,
];
