import { take, call, put, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import apiRequest from 'utils/api-request';
import {
  addEntity,
} from 'containers/App/actions';
import {
  SAVE,
} from './constants';

export function* saveAction({ data }) {
  try {
    const res = yield call(apiRequest, 'post', 'measures', data);
    yield put(addEntity('action', res.data));
  } catch (err) {
    // yield put(resourcesLoadingError(err));
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
