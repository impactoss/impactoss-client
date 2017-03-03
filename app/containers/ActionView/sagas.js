import { takeLatest, take, put, cancel, select } from 'redux-saga/effects';
import { loadEntitiesIfNeeded } from 'containers/App/actions';
import { LOCATION_CHANGE } from 'react-router-redux';
import { ENTITIES_READY } from 'containers/App/constants';
import { actionSelector } from './selectors';
import {
  setActionId,
  actionNotFound,
} from './actions';

import { GET_ACTION_BY_ID } from './constants';

function* getActionById(payload) {
  yield put(loadEntitiesIfNeeded('actions'));
  // Ok execution will wait at this take until Entities are loaded
  // if they already have been fetched this will take quickly, otherwise it will take as soon as we hear back from the api
  yield take(ENTITIES_READY);
  // Entiies are ready now, so set the action ID, this will cause the getAction selector to evaluate
  yield put(setActionId(payload.id));

  // Handle error case, where action can't be found
  const action = yield select(actionSelector);
  if (!action) {
    yield put(actionNotFound());
  }
}

// Individual exports for testing
export function* defaultSaga() {
  const watcher = yield takeLatest(GET_ACTION_BY_ID, getActionById);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
