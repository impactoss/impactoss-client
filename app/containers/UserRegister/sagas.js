import {
  takeLatest, put, take, cancel, call,
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { authenticate, otpRequired } from 'containers/App/actions';
import { registerUserRequest } from 'utils/entities-update';
import { clearAuthValues } from 'utils/api-request';

import { userRegisterSending, userRegisterSuccess, userRegisterError } from './actions';
import { REGISTER } from './constants';

export function* register({ data }) {
  try {
    yield put(userRegisterSending());
    const response = yield call(registerUserRequest, {
      email: data.email,
      password: data.password,
      password_confirmation: data.passwordConfirmation,
      name: data.name,
    });
    yield put(userRegisterSuccess());

    // Check if OTP is required after registration
    if (response.otp_required) {
      // Clear any stale auth tokens before showing OTP form
      yield call(clearAuthValues);
      yield put(otpRequired(response.temp_token, response.message));
    } else {
      // Normal flow: auto-login when MFA is disabled
      yield put(authenticate({ email: response.data.email, password: data.password }));
    }
  } catch (error) {
    error.response.json = yield error.response.json();
    yield put(userRegisterError(error));
  }
}

export function* registerSaga() {
  const registerWatcher = yield takeLatest(REGISTER, register);

  yield take(LOCATION_CHANGE);
  yield cancel(registerWatcher);
}

export default [registerSaga];
