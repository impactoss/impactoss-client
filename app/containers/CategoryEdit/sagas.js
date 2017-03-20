import { takeLatest, take, put, cancel, call } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { browserHistory } from 'react-router';

import apiRequest from 'utils/api-request';

import {
  updateEntity,
} from 'containers/App/actions';

import {
  saveSending,
  saveSuccess,
  saveError,
} from './actions';

import {
  SAVE,
} from './constants';

export function* saveAction({ id, data }) {
  try {
    yield put(saveSending());
    const res = yield call(apiRequest, 'put', `categories/${id}`, data);
    yield put(updateEntity('categories', res.data));
    yield put(saveSuccess());
    browserHistory.push(`/categories/${id}`);
  } catch (error) {
    const message = yield error.response.json();
    yield put(saveError(message.error));
  }
}

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
  const saveWatcher = yield takeLatest(SAVE, saveAction);

  yield take(LOCATION_CHANGE);
  yield cancel(saveWatcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
