import { takeLatest, take, put, cancel, select } from 'redux-saga/effects';
import { loadEntitiesIfNeeded } from 'containers/App/actions';
import { LOCATION_CHANGE } from 'react-router-redux';
import { ACTION_ENTITIES_READY } from 'containers/App/constants';
import { actionFoundSelector } from './selectors';
import {
  setActionId,
  actionNotFound,
} from './actions';

import { GET_ACTION_BY_ID } from './constants';

function* getActionById(payload) {
  yield put(setActionId(payload.id));

  let found = yield select(actionFoundSelector);
  if (!found) {
    yield put(loadEntitiesIfNeeded('actions'));
    // Execution will wait at this take until Entities are loaded
    // if they already have been fetched this will take quickly, otherwise it will take as soon as we hear back from the api
    yield take(ACTION_ENTITIES_READY);

    found = yield select(actionFoundSelector);
    if (!found) {
      // Handle error case, where action can't be found
      yield put(actionNotFound());
    }
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
