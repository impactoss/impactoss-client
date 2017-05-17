import { takeLatest, put, take, cancel, call } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { updatePasswordRequest } from 'utils/entities-update';

import { updatePath } from 'containers/App/actions';
import { actions as formActions } from 'react-redux-form/immutable';

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
      current_password: data.attributes.password,
      password: data.attributes.passwordNew,
      password_confirmation: data.attributes.passwordConfirmation,
    });

    yield put(passwordSuccess());

    yield put(updatePath(`/users/${data.id}`));
    yield put(formActions.reset('userPassword.form.data'));
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
