import { takeLatest, take, put, cancel, select, call } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { actions as formActions } from 'react-redux-form';
import { browserHistory } from 'react-router';

import apiRequest from 'utils/api-request';
import { ENTITIES_READY } from 'containers/App/constants';

import {
  loadEntitiesIfNeeded,
  updateEntity,
} from 'containers/App/actions';

import {
  setActionId,
  actionNotFound,
  saveSending,
  saveSuccess,
  saveError,
} from './actions';

import {
  actionSelector,
  idSelector,
} from './selectors';

import {
  GET_ACTION_BY_ID,
  SAVE,
} from './constants';

function* getActionById(payload) {
  yield put(loadEntitiesIfNeeded('actions'));
  // Ok execution will wait at this take until Entities are loaded
  // if they already have been fetched this will take quickly, otherwise it will take as soon as we hear back from the api
  yield take(ENTITIES_READY);
  // Entities are ready now, so set the action ID
  yield put(setActionId(payload.id));

  const action = yield select(actionSelector);
  if (!action) {
    // Handle error case, where action can't be found
    yield put(actionNotFound());
  } else {
    // populate the form
    yield put(formActions.load('actionEdit.form.action', action.get('attributes')));
  }
}

export function* saveAction({ data }) {
  try {
    yield put(saveSending());
    const id = yield select(idSelector);
    const res = yield call(apiRequest, 'put', `measures/${id}`, data);
    yield put(updateEntity('action', res.data));
    yield put(saveSuccess());
    browserHistory.push(`/actions/${id}`);
  } catch (error) {
    const message = yield error.response.json();
    yield put(saveError(message.error));
  }
}

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
  const watcher = yield takeLatest(GET_ACTION_BY_ID, getActionById);
  const saveWatcher = yield takeLatest(SAVE, saveAction);

  yield take(LOCATION_CHANGE);
  yield cancel(saveWatcher);

  yield cancel(watcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
