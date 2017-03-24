import { takeLatest, take, put, cancel, call } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import { browserHistory } from 'react-router';

import apiRequest from 'utils/api-request';

import {
  updateEntity,
  deleteEntity,
  addEntity,
} from 'containers/App/actions';

import {
  saveSending,
  saveSuccess,
  saveError,
} from './actions';

import {
  SAVE,
} from './constants';

export function* saveAction({ data }) {
  try {
    yield put(saveSending());
    const recRes = yield call(updateRecommendations, data);
    yield recRes.map((r) =>
      typeof r === 'object'
        ? put(addEntity('recommendation_measures', r.data))
        : put(deleteEntity('recommendation_measures', r))
    );
    const taxonomyRes = yield call(updateTaxonomies, data);
    yield taxonomyRes.map((r) =>
      typeof r === 'object'
        ? put(addEntity('measure_categories', r.data))
        : put(deleteEntity('measure_categories', r))
    );

    const res = yield call(apiRequest, 'put', `measures/${data.id}`, data.attributes);

    yield put(updateEntity('measures', {
      id: res.data.id,
      attributes: res.data.attributes,
    }));
    yield put(saveSuccess());
    browserHistory.push(`/actions/${data.id}`);
  } catch (error) {
    yield put(saveError(error));
  }
}

export function updateTaxonomies(data) {
  // create action-category associations
  const requests = [].concat(data.taxonomies.create.map((categoryId) =>
    // console.log('create', categoryId, data.id)
    apiRequest('post', 'measure_categories/', { category_id: categoryId, measure_id: data.id })
  ))
  // delete action-category associations
  .concat(data.taxonomies.delete.map((assignedId) =>
    // console.log('delete', assignedId)
    apiRequest('delete', `measure_categories/${assignedId}`).then(() => assignedId)
  ));
  return Promise.all(requests);
}
export function updateRecommendations(data) {
  // create action-category associations
  const requests = [].concat(data.recommendations.create.map((recId) =>
    // console.log('create', categoryId, data.id)
    apiRequest('post', 'recommendation_measures/', { recommendation_id: recId, measure_id: data.id })
  ))
  // delete action-category associations
  .concat(data.recommendations.delete.map((assignedId) =>
    // console.log('delete', assignedId)
    apiRequest('delete', `recommendation_measures/${assignedId}`)
  ));
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
