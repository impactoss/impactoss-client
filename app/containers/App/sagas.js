/**
 * Gets the entities from server
 */

import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import collection from 'lodash/collection';
import { browserHistory } from 'react-router';

import {
    LOAD_ENTITIES_IF_NEEDED,
    SAVE_ENTITY,
    NEW_ENTITY,
    AUTHENTICATE,
    AUTHENTICATE_SUCCESS,
    LOGOUT,
    LOGOUT_SUCCESS,
    VALIDATE_TOKEN,
} from 'containers/App/constants';

import {
    loadingEntities,
    entitiesLoaded,
    entitiesLoadingError,
    authenticateSuccess,
    authenticateSending,
    authenticateError,
    logoutSuccess,
    entitiesRequested,
    entitiesReady,
    invalidateEntities,
    updateEntity,
    addEntity,
    deleteEntity,
    saveSending,
    saveSuccess,
    saveError,
} from 'containers/App/actions';

import {
  makeSelectNextPathname,
  getRequestedAt,
} from 'containers/App/selectors';

import {
  newEntityRequest,
  updateEntityRequest,
  updateAssociationsRequest,
} from 'utils/entities-update';
import apiRequest, { getAuthValues, clearAuthValues } from 'utils/api-request';

/**
 * Check if entities already present
 */
export function* checkEntitiesSaga(payload) {
  // requestedSelector returns the times that entities where fetched from the API
  const requestedAt = yield select(getRequestedAt, { path: payload.path });

  // If haven't requested yet, do so now.
  if (!requestedAt) {
    // First record that we are requesting
    yield put(entitiesRequested(payload.path, Date.now()));
    // Updates the loading state of the app
    yield put(loadingEntities(payload.path));
    try {
      // Actions are called measures on the server
      const serverPath = payload.path;
      // Call the API
      const response = yield call(apiRequest, 'get', serverPath);
      // Save response and set loading = false
      yield put(entitiesLoaded(collection.keyBy(response.data, 'id'), payload.path, Date.now()));
    } catch (err) {
      // Whoops Save error
      yield put(entitiesLoadingError(err, payload.path));
      // Clear the request time on error, This will cause us to try again next time, which we probably want to do?
      yield put(entitiesRequested(payload.path, null));
    }
  }
  // Entities are ready, let listeners know
  yield put(entitiesReady(payload.path, Date.now()));
}

export function* authenticateSaga(payload) {
  const { password, email } = payload.data;

  yield put(authenticateSending());

  try {
    const response = yield call(apiRequest, 'post', 'auth/sign_in', { email, password });

    yield put(authenticateSuccess(response.data));
    yield put(invalidateEntities());
  } catch (err) {
    err.response.json = yield err.response.json();
    yield put(authenticateError(err));
  }
}

export function* authenticateSuccessSaga() {
  const nextPathName = yield select(makeSelectNextPathname());
  yield put(push(nextPathName || '/'));
}

export function* logoutSaga() {
  try {
    yield call(apiRequest, 'delete', 'auth/sign_out');
    yield call(clearAuthValues);
    yield put(logoutSuccess());
  } catch (err) {
    yield call(clearAuthValues);
      // TODO ensure this is displayed
    yield put(authenticateError(err));
  }
}

export function* logoutSuccessSaga() {
  yield put(invalidateEntities());
  const nextPathName = yield select(makeSelectNextPathname());
  yield put(push(nextPathName || 'login'));
}

export function* validateTokenSaga() {
  try {
    const { uid, client, 'access-token': accessToken } = yield getAuthValues();
    if (uid && client && accessToken) {
      yield put(authenticateSending());
      const response = yield call(apiRequest, 'get', 'auth/validate_token', { uid, client, 'access-token': accessToken });
      yield put(authenticateSuccess(response.data));
    }
  } catch (err) {
    yield call(clearAuthValues);
    err.response.json = yield err.response.json();
    yield put(authenticateError(err));
  }
}

export function* saveEntitySaga({ data }) {
  try {
    yield put(saveSending());

    // update entity attributes
    // on the server
    const entityUpdated = yield call(updateEntityRequest, data.path, data.entity);
    // and on the client
    yield put(updateEntity(data.path, {
      id: entityUpdated.data.id,
      attributes: entityUpdated.data.attributes,
    }));

    // update recommendation-action connections
    if (data.entity.recommendationMeasures) {
      // on the server
      const connectionsUpdated = yield call(
        updateAssociationsRequest,
        'recommendation_measures',
        data.entity.recommendationMeasures
      );
      // and on the client
      yield connectionsUpdated.map((connection) => connection.type === 'delete'
        ? put(deleteEntity('recommendation_measures', connection.id))
        : put(addEntity('recommendation_measures', connection.data))
      );
    }

    // update action-category connections
    if (data.entity.measureCategories) {
      // on the server
      const connectionsUpdated = yield call(
        updateAssociationsRequest,
        'measure_categories',
        data.entity.measureCategories
      );
      // and on the client
      yield connectionsUpdated.map((connection) => connection.type === 'delete'
        ? put(deleteEntity('measure_categories', connection.id))
        : put(addEntity('measure_categories', connection.data))
      );
    }

    // update recommendation-category connections
    if (data.entity.recommendationCategories) {
      // on the server
      const connectionsUpdated = yield call(
        updateAssociationsRequest,
        'recommendation_categories',
        data.entity.recommendationCategories
      );
      // and on the client
      yield connectionsUpdated.map((connection) => connection.type === 'delete'
        ? put(deleteEntity('recommendation_categories', connection.id))
        : put(addEntity('recommendation_categories', connection.data))
      );
    }

    yield put(saveSuccess());
    yield browserHistory.push(data.redirect);
  } catch (error) {
    yield put(saveError('An error occurred saving all or parts of your changes. Please review carefully and try again. '));
    yield put(invalidateEntities());
  }
}

export function* newEntitySaga({ data }) {
  try {
    yield put(saveSending());
    // update entity attributes
    // on the server
    const entityCreated = yield call(newEntityRequest, data.path, data.entity.attributes);
    yield put(addEntity(data.path, entityCreated.data));

    // check for associations/connections
    // update recommendation-action connections
    if (data.entity.recommendationMeasures) {
      // make sure to use new entity id for full payload
      // we should have either the one (recommendation_id) or the other (measure_id)
      const recommendationMeasures = data.entity.recommendationMeasures;
      recommendationMeasures.create = recommendationMeasures.create.map((create) => ({
        recommendation_id: create.recommendation_id || entityCreated.data.id,
        measure_id: create.measure_id || entityCreated.data.id,
      }));
      // on the server
      const connectionsUpdated = yield call(
        updateAssociationsRequest,
        'recommendation_measures',
        recommendationMeasures
      );
      // and on the client
      yield connectionsUpdated.map((connection) => connection.type === 'delete'
        ? put(deleteEntity('recommendation_measures', connection.id))
        : put(addEntity('recommendation_measures', connection.data))
      );
    }

    // update action-category connections
    if (data.entity.measureCategories) {
      // make sure to use new entity id for full payload
      const categories = data.entity.measureCategories;
      categories.create = categories.create.map((create) => ({
        category_id: create.category_id,
        measure_id: entityCreated.data.id,
      }));
      // on the server
      const connectionsUpdated = yield call(
        updateAssociationsRequest,
        'measure_categories',
        categories
      );
      // and on the client
      yield connectionsUpdated.map((connection) => connection.type === 'delete'
        ? put(deleteEntity('measure_categories', connection.id))
        : put(addEntity('measure_categories', connection.data))
      );
    }

    // update recommendation-category connections
    if (data.entity.recommendationCategories) {
      // make sure to use new entity id for full payload
      const categories = data.entity.recommendationCategories;
      categories.create = categories.create.map((create) => ({
        category_id: create.category_id,
        recommendation_id: entityCreated.data.id,
      }));
      // on the server
      const connectionsUpdated = yield call(
        updateAssociationsRequest,
        'recommendation_categories',
        categories
      );
      // and on the client
      yield connectionsUpdated.map((connection) => connection.type === 'delete'
        ? put(deleteEntity('recommendation_categories', connection.id))
        : put(addEntity('recommendation_categories', connection.data))
      );
    }

    yield put(saveSuccess());
    yield browserHistory.push(`${data.redirect}/${entityCreated.data.id}`);
  } catch (error) {
    // console.error(error);
    yield put(saveError('An error occurred saving your data. Please review carefully and try again. '));
    yield put(invalidateEntities());
  }
}


/**
 * Root saga manages watcher lifecycle
 */
export default function* rootSaga() {
  // console.log('calling rootSaga');
  yield takeEvery(VALIDATE_TOKEN, validateTokenSaga);
  yield takeEvery(LOAD_ENTITIES_IF_NEEDED, checkEntitiesSaga);

  yield takeEvery(SAVE_ENTITY, saveEntitySaga);
  yield takeEvery(NEW_ENTITY, newEntitySaga);

  yield takeLatest(AUTHENTICATE, authenticateSaga);
  yield takeLatest(AUTHENTICATE_SUCCESS, authenticateSuccessSaga);
  yield takeLatest(LOGOUT, logoutSaga);
  yield takeLatest(LOGOUT_SUCCESS, logoutSuccessSaga);
}
