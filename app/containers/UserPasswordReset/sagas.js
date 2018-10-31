import { takeLatest, put, take, cancel, select, call } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { selectLocation } from 'containers/App/selectors';
import { updatePath } from 'containers/App/actions';

import { PATHS } from 'containers/App/constants';
import { ENDPOINTS, KEYS } from 'themes/config';

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
      ENDPOINTS.PASSWORD,
      {
        password,
        password_confirmation: passwordConfirmation,
      },
      {
        [KEYS.CLIENT]: query.get('client_id'),
        [KEYS.RESET_PASSWORD]: query.get('reset_password'),
        [KEYS.ACCESS_TOKEN]: query.get('token'),
        [KEYS.UID]: query.get('uid'),
        [KEYS.EXPIRY]: query.get('expiry'),
      }
    );
    yield put(passwordResetSuccess());
    yield put(updatePath(PATHS.LOGIN));
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
