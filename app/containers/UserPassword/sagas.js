import {
  takeLatest, put, take, cancel, call,
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { updatePasswordRequest } from 'utils/entities-update';

import { ROUTES } from 'containers/App/constants';
import { updatePath } from 'containers/App/actions';

import {
  passwordSending,
  passwordSuccess,
  passwordError,
} from './actions';
import { SAVE } from './constants';


export function* save({ data }) {
  try {
    yield put(passwordSending());
    yield call(updatePasswordRequest, {
      id: data.id,
      current_password: data.password,
      password: data.passwordNew,
      password_confirmation: data.passwordConfirmation,
    });

    yield put(passwordSuccess());

    yield put(updatePath(`${ROUTES.USERS}/${data.id}`));
  } catch (error) {
    error.response.json = yield error.response.json();
    yield put(passwordError(error));
  }
}

export function* defaultSaga() {
  const watcher = yield takeLatest(SAVE, save);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  defaultSaga,
];
