import { takeLatest, take, put, cancel, select, call } from 'redux-saga/effects';
import { loadEntitiesIfNeeded, updateEntity } from 'containers/App/actions';
import { LOCATION_CHANGE } from 'react-router-redux';
import { ENTITIES_POPULATED } from 'containers/App/constants';
import { actionsSelector } from 'containers/App/selectors';
import apiRequest from 'utils/api-request';
import { actions as formActions } from 'react-redux-form';
import { browserHistory } from 'react-router';

import { addActionId, getEntitiesLoading, getEntitiesSuccess, getEntitiesError, loadActionError, saveSending, saveSuccess, saveError } from './actions';
import { GET_ENTITIES_AND_ACTION_BY_ID, SAVE } from './constants';
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
    const action = actions.get(id).get('attributes').toJS();
    const { title, description, draft } = action;
    // TODO could use merge and do this in one line, except need to use redux thunk
    yield put(formActions.change('actionEdit.form.action.title', title));
    yield put(formActions.change('actionEdit.form.action.description', description));
    yield put(formActions.change('actionEdit.form.action.draft', draft));
  } catch (err) {
    yield put(loadActionError(err));
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
  const watcher = yield takeLatest(GET_ENTITIES_AND_ACTION_BY_ID, checkEntities);
  const entitiesWatcher = yield takeLatest(ENTITIES_POPULATED, getActionById);
  const saveWatcher = yield takeLatest(SAVE, saveAction);

  yield take(LOCATION_CHANGE);
  yield cancel(saveWatcher);
  yield cancel(watcher);
  yield cancel(entitiesWatcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
