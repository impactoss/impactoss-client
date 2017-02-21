import { takeLatest, take, put, cancel, select } from 'redux-saga/effects';
import { loadEntitiesIfNeeded } from 'containers/App/actions';
import { LOCATION_CHANGE } from 'react-router-redux';
import { ENTITIES_POPULATED } from 'containers/App/constants';
import { actionsSelector } from 'containers/App/selectors';

import { loadAction, addActionId, getEntitiesLoading, getEntitiesSuccess, getEntitiesError, loadActionError } from './actions';
import { GET_ENTITIES_AND_ACTION_BY_ID } from './constants';
import { idSelector } from './selectors';

function* checkEntities(payload) {
  try {
    yield put(getEntitiesLoading());
    yield put(addActionId(payload.id));
    yield put(loadEntitiesIfNeeded(payload.path));
    yield put(getEntitiesSuccess());
  } catch (err) {
    // TODO handle the error
    yield put(getEntitiesError(err));
  }
}

function* getActionById() {
  try {
    const actions = yield select(actionsSelector);
    const id = yield select(idSelector);
    const action = actions.get(id);
    yield put(loadAction(action));
  } catch (err) {
    yield put(loadActionError(err));
  }
}

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
  const watcher = yield takeLatest(GET_ENTITIES_AND_ACTION_BY_ID, checkEntities);
  const entitiesWatcher = yield takeLatest(ENTITIES_POPULATED, getActionById);
  yield take(LOCATION_CHANGE);
  yield cancel(watcher);
  yield cancel(entitiesWatcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
