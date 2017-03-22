import { takeLatest, take, put, cancel, call } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { browserHistory } from 'react-router';
import { omit } from 'lodash/object';

import apiRequest from 'utils/api-request';

import {
  updateEntity,
} from 'containers/App/actions';

import {
  saveSending,
  saveSuccess,
  saveError,
} from './actions';

import {
  SAVE,
} from './constants';

export function* saveAction({ id, data }) {
  try {
    yield put(saveSending());
    yield call(saveTaxonomies, id, data);
    const res = yield call(apiRequest, 'put', `measures/${id}`, omit(data, ['taxonomies']));
    yield put(updateEntity('measures', res.data));
    yield put(saveSuccess());
    browserHistory.push(`/actions/${id}`);
  } catch (error) {
    const message = yield error.response.json();
    yield put(saveError(message.error));
  }
}

export function saveTaxonomies(id, data) {
  const requests = data.taxonomies.create.map((categoryId) => apiRequest('post', 'measure_categories/', { category_id: categoryId, measure_id: id }));
  // TODO handle deletes
  // requests.concat(Object.keys(data.taxonomies.delete).map((categoryId) => apiRequest('post',`measure_categories/`,{category_id: categoryId, measure_id, measure_id: id}));
  return Promise.all(requests);
}

// Individual exports for testing
export function* defaultSaga() {
  // See example in containers/HomePage/sagas.js
  const saveWatcher = yield takeLatest(SAVE, saveAction);

  yield take(LOCATION_CHANGE);
  yield cancel(saveWatcher);
}

// All sagas to be loaded
export default [
  defaultSaga,
];
