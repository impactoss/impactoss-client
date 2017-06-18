import { take, put, cancel, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { newEntity } from 'containers/App/actions';

import { SAVE } from './constants';

export function* save({ data }) {
  yield put(newEntity({
    path: 'measures',
    entity: data,
    redirect: false,
    timestamp: Date.now(),
  }));
}


export function* defaultSaga() {
  const saveWatcher = yield takeEvery(SAVE, save);

  yield take(LOCATION_CHANGE);

  yield cancel(saveWatcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
