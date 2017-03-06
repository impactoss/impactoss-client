import { take, call, put, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import apiRequest from 'utils/api-request';
import { browserHistory } from 'react-router';
import { actions } from 'react-redux-form';

import {
  addEntity,
} from 'containers/App/actions';
import {
  saveSending,
  saveSuccess,
  saveError,
} from './actions';
import {
  SAVE,
} from './constants';

export function* saveAction({ data }) {
  try {
    yield put(saveSending());
    const res = yield call(apiRequest, 'post', 'measures', data);
    yield put(addEntity('action', res.data));
    yield put(saveSuccess());
    yield put(actions.reset('actionNew.form.action'));
    browserHistory.push(`/actions/${res.data.id}`);
  } catch (error) {
    const message = yield error.response.json();
    yield put(saveError(message.error));
  }
}

export function* actionSaga() {
  const saveWatcher = yield takeLatest(SAVE, saveAction);

  yield take(LOCATION_CHANGE);

  yield cancel(saveWatcher);
}

// All sagas to be loaded
export default [
  actionSaga,
];
