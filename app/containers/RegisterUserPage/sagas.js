import { takeLatest, put, select, take, cancel, call } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { registerUser, registerUserSending, registerUserSuccess, registerUserError } from 'containers/RegisterUserPage/actions';
import { authenticate } from 'containers/App/actions';
import apiRequest from 'utils/api-request';

import { SUBMIT_FORM, REGISTER_USER } from './constants';
import { registerCredentialsSelector } from './selectors';


export function* doRegister() {
  const credentials = yield select(registerCredentialsSelector);
  yield put(registerUser(credentials));
}

export function* registerUserSaga(payload) {
  yield put(registerUserSending(true));

  try {
    const { email, password, passwordConfirmation, name } = payload.data;
    const response = yield call(apiRequest, 'post', 'auth/', { email, password, password_confirmation: passwordConfirmation, name });
    yield put(registerUserSuccess(response.data));
    yield put(authenticate({ email, password }));
  } catch (err) {
    const response = yield err.response.json();

    // checking if response returns json TODO: need to handle if there is no response
    if (Object.keys(response)) {
      err.response = response;
    }

    yield put(registerUserError(err));
  }
}

export function* registerSaga() {
  const registerWatcher = yield takeLatest(SUBMIT_FORM, doRegister);
  const registerUserWatcher = yield takeLatest(REGISTER_USER, registerUserSaga);

  yield take(LOCATION_CHANGE);
  yield cancel(registerWatcher);
  yield cancel(registerUserWatcher);
}

export default [
  registerSaga,
];
