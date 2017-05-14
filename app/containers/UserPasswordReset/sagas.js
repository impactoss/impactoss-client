import { takeLatest, put, take, cancel, select, call } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { selectLocation } from 'containers/App/selectors';
import { updatePath } from 'containers/App/actions';

import apiRequest from 'utils/api-request';

import {
  passwordResetSending,
  passwordResetSuccess,
  passwordResetError,
} from './actions';

import { RESET } from './constants';

export function* reset({ data }) {
  const { password, passwordConfirmation } = data;
  try {
    const location = yield select(selectLocation);
    const query = yield location.get('query');
    yield put(passwordResetSending());
    yield call(
      apiRequest,
      'put',
      'auth/password',
      {
        password,
        password_confirmation: passwordConfirmation,
      },
      {
        client: query.get('client_id'),
        reset_password: query.get('reset_password'),
        'access-token': query.get('token'),
        uid: query.get('uid'),
        expiry: query.get('expiry'),
      }
    );
    yield put(passwordResetSuccess());
    yield put(updatePath('/login'));
  } catch (error) {
    error.response.json = yield error.response.json();
    yield put(passwordResetError(error));
  }
}

export function* defaultSaga() {
  const watcher = yield takeLatest(RESET, reset);

  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

export default [
  defaultSaga,
];
