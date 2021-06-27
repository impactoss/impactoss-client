import {
  takeLatest, put, take, cancel, call,
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { authenticate } from 'containers/App/actions';
import { registerUserRequest } from 'utils/entities-update';

import {
  userRegisterSending,
  userRegisterSuccess,
  userRegisterError,
} from './actions';
import { REGISTER } from './constants';


export function* register({ data }) {
  try {
    yield put(userRegisterSending());
    const userCreated = yield call(registerUserRequest, {
      email: data.attributes.email,
      password: data.attributes.password,
      password_confirmation: data.attributes.passwordConfirmation,
      name: data.attributes.name,
    });
    yield put(userRegisterSuccess());
    // login when successful
    yield put(authenticate({ email: userCreated.data.email, password: data.attributes.password }));
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

export default [
  registerSaga,
];
