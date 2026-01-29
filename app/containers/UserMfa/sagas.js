import { takeLatest, put, take, cancel, call } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { API } from 'themes/config';
import { ROUTES } from 'containers/App/constants';
import { updatePath, updateEntity } from 'containers/App/actions';
import apiRequest from 'utils/api-request';
import { ENABLE_MFA, DISABLE_MFA } from './constants';
import { saveSending, saveSuccess, saveError } from './actions';

export function* enableMfa({ data }) {
  const { userId, password } = data;
  try {
    yield put(saveSending());
    const response = yield call(apiRequest, 'post', `${API.USERS}/${userId}/enable_mfa`, { password });
    yield put(
      updateEntity(API.USERS, {
        id: response.data.id,
        attributes: response.data.attributes,
      }),
    );
    yield put(saveSuccess());
    yield put(updatePath(`${ROUTES.USERS}/${userId}`));
  } catch (err) {
    if (err.response) {
      err.response.json = yield err.response.json();
    }
    yield put(saveError(err));
  }
}

export function* disableMfa({ data }) {
  const { userId, password } = data;
  try {
    yield put(saveSending());
    const response = yield call(apiRequest, 'post', `${API.USERS}/${userId}/disable_mfa`, { password });
    yield put(
      updateEntity(API.USERS, {
        id: response.data.id,
        attributes: response.data.attributes,
      }),
    );
    yield put(saveSuccess());
    yield put(updatePath(`${ROUTES.USERS}/${userId}`));
  } catch (err) {
    if (err.response) {
      err.response.json = yield err.response.json();
    }
    yield put(saveError(err));
  }
}

export function* defaultSaga() {
  const enableWatcher = yield takeLatest(ENABLE_MFA, enableMfa);
  const disableWatcher = yield takeLatest(DISABLE_MFA, disableMfa);

  yield take(LOCATION_CHANGE);
  yield cancel(enableWatcher);
  yield cancel(disableWatcher);
}

export default [defaultSaga];
