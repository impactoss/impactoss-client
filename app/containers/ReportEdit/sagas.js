import { takeLatest, take, put, cancel } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
  saveEntity,
  dueDateAssigned,
} from 'containers/App/actions';

import { PATHS } from 'containers/App/constants';

import { SAVE } from './constants';


export function* save({ data, dueDateIdUnchecked }) {
  yield put(saveEntity({
    path: 'progress_reports',
    entity: data,
    redirect: `${PATHS.PROGRESS_REPORTS}/${data.id}`,
    invalidateEntitiesOnSuccess: dueDateIdUnchecked && 'due_dates',
  }));
  if (data.attributes.due_date_id) {
    yield put(dueDateAssigned(data.attributes.due_date_id));
  }
}

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
  const saveWatcher = yield takeLatest(SAVE, save);

  yield take(LOCATION_CHANGE);
  yield cancel(saveWatcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
