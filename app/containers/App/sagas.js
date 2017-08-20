/**
 * Gets the entities from server
 */

import { call, put, select, takeLatest, takeEvery, race, take } from 'redux-saga/effects';
import { push, goBack } from 'react-router-redux';
import { reduce, keyBy, find } from 'lodash/collection';
import { without } from 'lodash/array';

import asArray from 'utils/as-array';

import {
  LOAD_ENTITIES_IF_NEEDED,
  REDIRECT_IF_NOT_PERMITTED,
  SAVE_ENTITY,
  NEW_ENTITY,
  DELETE_ENTITY,
  AUTHENTICATE,
  LOGOUT,
  VALIDATE_TOKEN,
  INVALIDATE_ENTITIES,
  SAVE_CONNECTIONS,
  UPDATE_ROUTE_QUERY,
  AUTHENTICATE_FORWARD,
  USER_ROLES,
  UPDATE_PATH,
  // RESET_PASSWORD,
  RECOVER_PASSWORD,
  CLOSE_ENTITY,
  RECORD_OUTDATED,
} from 'containers/App/constants';

import {
  entitiesLoaded,
  entitiesLoadingError,
  authenticateSuccess,
  authenticateSending,
  authenticateError,
  logoutSuccess,
  entitiesRequested,
  invalidateEntities,
  updateEntity,
  updateConnections,
  addEntity,
  removeEntity,
  saveSending,
  saveSuccess,
  saveError,
  deleteSending,
  deleteSuccess,
  deleteError,
  recoverSending,
  recoverSuccess,
  recoverError,
  forwardOnAuthenticationChange,
} from 'containers/App/actions';

import {
  selectPreviousPathname,
  selectCurrentPathname,
  selectRequestedAt,
  selectIsSignedIn,
  selectLocation,
  selectSessionUserRoles,
  selectIsAuthenticating,
} from 'containers/App/selectors';

import {
  newEntityRequest,
  deleteEntityRequest,
  updateEntityRequest,
  updateAssociationsRequest,
} from 'utils/entities-update';
import apiRequest, { getAuthValues, clearAuthValues } from 'utils/api-request';

/**
 * Check if entities already present
 */
export function* checkEntitiesSaga(payload) {
  // requestedSelector returns the times that entities where fetched from the API
  const requestedAt = yield select(selectRequestedAt, { path: payload.path });

  // If haven't requested yet, do so now.
  if (!requestedAt) {
    const signedIn = yield select(selectIsSignedIn);

    try {
      // First record that we are requesting
      yield put(entitiesRequested(payload.path, Date.now()));
      // check role to prevent requesting endpoints not authorised
      // TODO check could be refactored
      if (!signedIn && (payload.path === 'user_roles' || payload.path === 'users')) {
        // store empty response so the app wont wait for the results
        yield put(entitiesLoaded({}, payload.path, Date.now()));
      } else {
        // Call the API, cancel on invalidate
        const { response } = yield race({
          response: call(apiRequest, 'get', payload.path),
          cancel: take(INVALIDATE_ENTITIES), // will also reset entities requested
        });
        if (response) {
          // Save response
          yield put(entitiesLoaded(keyBy(response.data, 'id'), payload.path, Date.now()));
        } else {
          yield call(checkEntitiesSaga, payload);
        }
      }
    } catch (err) {
      // Whoops Save error
      yield put(entitiesLoadingError(err, payload.path));
      // Clear the request time on error, This will cause us to try again next time, which we probably want to do?
      yield put(entitiesRequested(payload.path, null));
    }
  }
}
/**
 * Check if user is authorized
 */
export function* checkRoleSaga({ role }) {
  const signedIn = yield select(selectIsSignedIn);
  const authenticating = yield select(selectIsAuthenticating);
  if (signedIn) {
    const roleIds = yield select(selectSessionUserRoles);
    if (!(roleIds.includes(role)
      || (role === USER_ROLES.MANAGER && roleIds.includes(USER_ROLES.ADMIN))
      || (role === USER_ROLES.CONTRIBUTOR && (roleIds.includes(USER_ROLES.MANAGER) || roleIds.includes(USER_ROLES.ADMIN)))
    )) {
      yield put(push('/login'));
    }
  } else if (!authenticating) {
    yield put(push('/login'));
  }
}

export function* authenticateSaga(payload) {
  const { password, email } = payload.data;
  try {
    yield put(authenticateSending());
    const response = yield call(apiRequest, 'post', 'auth/sign_in', { email, password });
    yield put(authenticateSuccess(response.data));
    yield put(forwardOnAuthenticationChange());
    yield put(invalidateEntities());
  } catch (err) {
    err.response.json = yield err.response.json();
    yield put(authenticateError(err));
  }
}

export function* recoverSaga(payload) {
  const { email } = payload.data;
  try {
    yield put(recoverSending());
    yield call(apiRequest, 'post', 'auth/password', {
      email,
      redirect_url: `${window.location.origin}/resetpassword`, // TODO WIP
    });
    yield put(recoverSuccess());
    // forward to login
    yield put(push('/login'));
  } catch (err) {
    err.response.json = yield err.response.json();
    yield put(recoverError(err));
  }
}

const authRoutes = ['/login', '/register', '/logout'];
export function* authChangeSaga() {
  const prevPathname = yield select(selectPreviousPathname);
  if (prevPathname && authRoutes.indexOf(prevPathname) < 0) {
    yield put(push(prevPathname));
  } else {
    // forward to home
    yield put(push('/'));
  }
}

export function* logoutSaga() {
  try {
    yield call(apiRequest, 'delete', 'auth/sign_out');
    yield call(clearAuthValues);
    yield put(logoutSuccess());
    yield put(push('/login'));
    yield put(invalidateEntities());
  } catch (err) {
    yield call(clearAuthValues);
    yield put(authenticateError(err));
  }
}

export function* validateTokenSaga() {
  try {
    const { uid, client, 'access-token': accessToken } = yield getAuthValues();
    if (uid && client && accessToken) {
      yield put(authenticateSending());
      const response = yield call(apiRequest, 'get', 'auth/validate_token', { uid, client, 'access-token': accessToken });
      if (!response.success) {
        yield call(clearAuthValues);
        yield put(invalidateEntities());
      }
      yield put(authenticateSuccess(response.data)); // need to store currentUserData
    }
  } catch (err) {
    yield call(clearAuthValues);
    err.response.json = yield err.response.json();
    yield put(authenticateError(err));
  }
}


function stampPayload(payload) {
  return Object.assign(payload, {
    timestamp: `${Date.now()}-${Math.random().toString(36).slice(-8)}`,
  });
}


function* createConnectionsSaga({ entityId, path, updates, keyPair }) {
  // make sure to use new entity id for full payload
  // we should have either the one (recommendation_id) or the other (measure_id)
  const updatesUpdated = updates;
  updatesUpdated.create = updatesUpdated.create.map((create) => ({
    [keyPair[0]]: create[keyPair[0]] || entityId,
    [keyPair[1]]: create[keyPair[1]] || entityId,
  }));

  yield call(saveConnectionsSaga, { data: { path, updates: updatesUpdated } });
}

export function* saveEntitySaga({ data }) {
  const dataTS = stampPayload(data);
  try {
    yield put(saveSending(dataTS));
    // update entity attributes
    const entityUpdated = yield call(updateEntityRequest, data.path, data.entity);
    // and on the client
    yield put(updateEntity(data.path, {
      id: entityUpdated.data.id,
      attributes: entityUpdated.data.attributes,
    }));

    // update user-roles connections
    if (data.entity.userRoles) {
      yield call(saveConnectionsSaga, {
        data: {
          path: 'user_roles',
          updates: data.entity.userRoles,
        },
      });
    }

    // update user-category connections
    if (data.entity.userCategories) {
      yield call(saveConnectionsSaga, {
        data: {
          path: 'user_categories',
          updates: data.entity.userCategories,
        },
      });
    }

    // update recommendation-measure connections
    if (data.entity.recommendationMeasures) {
      yield call(saveConnectionsSaga, {
        data: {
          path: 'recommendation_measures',
          updates: data.entity.recommendationMeasures,
        },
      });
    }

    // update measure-indicatos connections
    if (data.entity.measureIndicators) {
      yield call(saveConnectionsSaga, {
        data: {
          path: 'measure_indicators',
          updates: data.entity.measureIndicators,
        },
      });
    }

    // update measure-category connections
    if (data.entity.measureCategories) {
      yield call(saveConnectionsSaga, {
        data: {
          path: 'measure_categories',
          updates: data.entity.measureCategories,
        },
      });
    }

    // update sdgtarget-indicatos connections
    if (data.entity.sdgtargetIndicators) {
      yield call(saveConnectionsSaga, {
        data: {
          path: 'sdgtarget_indicators',
          updates: data.entity.sdgtargetIndicators,
        },
      });
    }

    // update sdgtarget-measure connections
    if (data.entity.sdgtargetMeasures) {
      yield call(saveConnectionsSaga, {
        data: {
          path: 'sdgtarget_measures',
          updates: data.entity.sdgtargetMeasures,
        },
      });
    }

    // update measure-category connections
    if (data.entity.sdgtargetCategories) {
      yield call(saveConnectionsSaga, {
        data: {
          path: 'sdgtarget_categories',
          updates: data.entity.sdgtargetCategories,
        },
      });
    }

    // update recommendation-category connections
    if (data.entity.recommendationCategories) {
      yield call(saveConnectionsSaga, {
        data: {
          path: 'recommendation_categories',
          updates: data.entity.recommendationCategories,
        },
      });
    }

    yield put(saveSuccess(dataTS));
    if (data.redirect) {
      yield put(push(data.redirect));
    }
    if (data.invalidateEntitiesOnSuccess) {
      yield put(invalidateEntities(data.invalidateEntitiesOnSuccess));
    }
  } catch (err) {
    err.response.json = yield err.response.json();
    yield put(saveError(err, dataTS));
    if (err.response.json && err.response.json.error === RECORD_OUTDATED) {
      yield put(invalidateEntities(data.path));
    }
  }
}

export function* deleteEntitySaga({ data }) {
  const dataTS = stampPayload(data);
  try {
    yield put(deleteSending(dataTS));
    yield call(deleteEntityRequest, data.path, data.id);
    if (data.redirect !== false) {
      yield put(push(`/${data.redirect || data.path}`));
    }
    yield put(removeEntity(data.path, data.id));
    yield put(deleteSuccess(dataTS));
  } catch (err) {
    err.response.json = yield err.response.json();
    yield put(deleteError(err, dataTS));
  }
}

export function* newEntitySaga({ data }) {
  const dataTS = stampPayload(data);
  try {
    yield put(saveSending(dataTS));
    // update entity attributes
    // on the server
    const entityCreated = yield call(newEntityRequest, data.path, data.entity.attributes);
    yield put(addEntity(data.path, entityCreated.data));

    // check for associations/connections
    // update recommendation-action connections
    if (data.entity.recommendationMeasures) {
      yield call(createConnectionsSaga, {
        entityId: entityCreated.data.id,
        path: 'recommendation_measures',
        updates: data.entity.recommendationMeasures,
        keyPair: ['recommendation_id', 'measure_id'],
      });
    }

    // update action-indicator connections
    if (data.entity.measureIndicators) {
      yield call(createConnectionsSaga, {
        entityId: entityCreated.data.id,
        path: 'measure_indicators',
        updates: data.entity.measureIndicators,
        keyPair: ['indicator_id', 'measure_id'],
      });
    }

    // update action-category connections
    if (data.entity.measureCategories) {
      yield call(createConnectionsSaga, {
        entityId: entityCreated.data.id,
        path: 'measure_categories',
        updates: data.entity.measureCategories,
        keyPair: ['category_id', 'measure_id'],
      });
    }

    // update sdgtarget-indicator connections
    if (data.entity.sdgtargetIndicators) {
      yield call(createConnectionsSaga, {
        entityId: entityCreated.data.id,
        path: 'sdgtarget_indicators',
        updates: data.entity.sdgtargetIndicators,
        keyPair: ['indicator_id', 'sdgtarget_id'],
      });
    }

    // update sdgtarget-indicator connections
    if (data.entity.sdgtargetMeasures) {
      yield call(createConnectionsSaga, {
        entityId: entityCreated.data.id,
        path: 'sdgtarget_measures',
        updates: data.entity.sdgtargetMeasures,
        keyPair: ['measure_id', 'sdgtarget_id'],
      });
    }

    // update sdgtarget-category connections
    if (data.entity.sdgtargetCategories) {
      yield call(createConnectionsSaga, {
        entityId: entityCreated.data.id,
        path: 'sdgtarget_categories',
        updates: data.entity.sdgtargetCategories,
        keyPair: ['category_id', 'sdgtarget_id'],
      });
    }

    // update recommendation-category connections
    if (data.entity.recommendationCategories) {
      yield call(createConnectionsSaga, {
        entityId: entityCreated.data.id,
        path: 'recommendation_categories',
        updates: data.entity.recommendationCategories,
        keyPair: ['category_id', 'recommendation_id'],
      });
    }

    yield put(saveSuccess(dataTS));
    if (data.onSuccess) {
      data.onSuccess();
    }
    if (data.redirect) {
      yield put(push(`${data.redirect}/${entityCreated.data.id}`));
    }
  } catch (err) {
    err.response.json = yield err.response.json();
    yield put(saveError(err, dataTS));
  }
}
//
// // Batch update entity attributes
// export function* saveEntitiesSaga({ data }) {
//   const dataTS = stampPayload(data);
//   try {
//     yield put(saveSending(dataTS));
//     // on the server
//     const entitiesUpdated = yield call(updateEntitiesRequest, data.path, data.entities);
//     // // and on the client
//     yield put(updateEntities(data.path, entitiesUpdated));
//     yield put(saveSuccess(dataTS));
//   } catch (err) {
//     err.response.json = yield err.response.json();
//     yield put(saveError(err, dataTS));
//     yield put(invalidateEntities());
//   }
// }
//
export function* saveConnectionsSaga({ data }) {
  if (data.updates && (
    (data.updates.create && data.updates.create.length > 0)
    || (data.updates.delete && data.updates.delete.length > 0)
  )) {
    const dataTS = stampPayload(data);
    try {
      yield put(saveSending(dataTS));
      // on the server
      const connectionsUpdated = yield call(updateAssociationsRequest, data.path, data.updates);
      // and on the client
      yield put(updateConnections(data.path, connectionsUpdated));
      yield put(saveSuccess(dataTS));
    } catch (err) {
      err.response.json = yield err.response.json();
      yield put(saveError(err, dataTS));
      yield put(invalidateEntities(data.path));
    }
  }
}

export function* updateRouteQuerySaga({ query, extend = true }) {
  // TODO consider using history.js's updateQueryStringParams
  const location = yield select(selectLocation);
  // figure out new query
  // get old query or new query if not extending (replacing)
  const queryPrevious = extend ? location.get('query').toJS() : {};
  // and figure out new query
  const queryNext = asArray(query).reduce((q, param) => {
    const queryUpdated = q;
    // if already set and not replacing
    if (queryUpdated[param.arg] && !param.replace) {
      // if multiple values set
      if (Array.isArray(queryUpdated[param.arg])) {
        // add if not already present
        if (param.add && queryUpdated[param.arg].indexOf(param.value.toString()) === -1) {
          queryUpdated[param.arg].push(param.value);
        }
        // remove if present
        if (extend && param.remove && queryUpdated[param.arg].indexOf(param.value.toString()) > -1) {
          queryUpdated[param.arg] = without(queryUpdated[param.arg], param.value.toString());
          // convert to single value if only one value left
          if (queryUpdated[param.arg].length === 1) {
            queryUpdated[param.arg] = queryUpdated[param.arg][0];
          }
        }
      // if single value set
      } else {
        // add if not already present and convert to array
        if (param.add && queryUpdated[param.arg] !== param.value.toString()) {
          queryUpdated[param.arg] = [queryUpdated[param.arg], param.value];
        }
        // remove if present
        if (extend && param.remove && queryUpdated[param.arg] === param.value.toString()) {
          delete queryUpdated[param.arg];
        }
      }
    // if not already set or replacing
    } else if (param.add || param.replace) {
      if (param.remove) {
        delete queryUpdated[param.arg];
      } else {
        queryUpdated[param.arg] = param.value;
      }
    }
    return queryUpdated;
  }, queryPrevious);

  // convert to string
  const queryNextString = reduce(queryNext, (result, value, key) => {
    let params;
    if (Array.isArray(value)) {
      params = value.reduce((memo, val) => `${memo}${memo.length > 0 ? '&' : ''}${key}=${encodeURIComponent(val)}`, '');
    } else {
      params = `${key}=${encodeURIComponent(value)}`;
    }
    return `${result}${result.length > 0 ? '&' : ''}${params}`;
  }, '');

  yield put(push(`${location.get('pathname')}?${queryNextString}`));
}

export function* updatePathSaga({ path }) {
  yield put(push(path.startsWith('/') ? path : `/${path}`));
}

const backTargetIgnore = ['/edit', '/new', 'login', '/reports'];

export function* closeEntitySaga({ path }) {
  // the close icon is to function like back if possible, otherwise go to default path provided
  const previousPath = yield select(selectPreviousPathname);
  const currentPath = yield select(selectCurrentPathname);
  if (previousPath // previous path exists
    && previousPath !== currentPath // previous path is not the same as the current path
    && !find(backTargetIgnore, (target) => previousPath.includes(target)) // and previous path is not one of the edit or login paths
  ) {
    yield put(goBack());
  } else {
    yield put(push(path || '/'));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* rootSaga() {
  // console.log('calling rootSaga');
  yield takeLatest(VALIDATE_TOKEN, validateTokenSaga);

  yield takeLatest(AUTHENTICATE, authenticateSaga);
  // yield takeLatest(RESET_PASSWORD, resetSaga);
  yield takeLatest(RECOVER_PASSWORD, recoverSaga);
  yield takeLatest(LOGOUT, logoutSaga);
  yield takeLatest(AUTHENTICATE_FORWARD, authChangeSaga);

  yield takeEvery(SAVE_ENTITY, saveEntitySaga);
  yield takeEvery(NEW_ENTITY, newEntitySaga);
  yield takeEvery(DELETE_ENTITY, deleteEntitySaga);
  yield takeEvery(SAVE_CONNECTIONS, saveConnectionsSaga);
  // yield takeEvery(SAVE_ENTITIES, saveEntitiesSaga);

  yield takeEvery(LOAD_ENTITIES_IF_NEEDED, checkEntitiesSaga);
  yield takeLatest(REDIRECT_IF_NOT_PERMITTED, checkRoleSaga);
  yield takeEvery(UPDATE_ROUTE_QUERY, updateRouteQuerySaga);
  yield takeEvery(UPDATE_PATH, updatePathSaga);

  yield takeEvery(CLOSE_ENTITY, closeEntitySaga);
}
