import { take, put, cancel, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { newEntity } from 'containers/App/actions';

import { SAVE } from './constants';

export function* save({ data }) {
  yield put(newEntity({
    path: 'indicators',
    entity: data,
    redirect: '/indicators',
    invalidateEntitiesOnSuccess: 'due_dates',    // force due_date reload to get newly generated due_dates
  }));
}

export function* defaultSaga() {
  const saveWatcher = yield takeLatest(SAVE, save);

  yield take(LOCATION_CHANGE);

  yield cancel(saveWatcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
