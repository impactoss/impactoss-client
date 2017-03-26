import { take, put, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
  newEntity,
} from 'containers/App/actions';

import {
  SAVE,
} from './constants';

export function* saveAction({ data }) {
  yield put(newEntity({
    path: 'measures',
    entity: data,
    redirect: '/actions',
  }));
}

export function* defaultSaga() {
  const saveWatcher = yield takeLatest(SAVE, saveAction);

  yield take(LOCATION_CHANGE);

  yield cancel(saveWatcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
