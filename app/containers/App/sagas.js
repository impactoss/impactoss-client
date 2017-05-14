/**
 * Gets the entities from server
 */

import { call, put, select, takeLatest, takeEvery, race, take } from 'redux-saga/effects';
import { push } from 'react-router-redux';
import { reduce, keyBy } from 'lodash/collection';
import { without } from 'lodash/array';

import {
  LOAD_ENTITIES_IF_NEEDED,
  REDIRECT_IF_NOT_PERMITTED,
  SAVE_ENTITY,
  NEW_ENTITY,
  AUTHENTICATE,
  LOGOUT,
  VALIDATE_TOKEN,
  INVALIDATE_ENTITIES,
  UPDATE_CONNECTIONS,
  UPDATE_ENTITIES,
  UPDATE_ROUTE_QUERY,
  AUTHENTICATE_FORWARD,
  USER_ROLES,
  UPDATE_PATH,
  // RESET_PASSWORD,
  RECOVER_PASSWORD,
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
  addEntity,
  deleteEntity,
  saveSending,
  saveSuccess,
  saveError,
  forwardOnAuthenticationChange,
} from 'containers/App/actions';

import {
  makeSelectPathnameOnAuthChange,
  makeSelectPreviousPathname,
  getRequestedAt,
  isSignedIn,
  selectLocation,
  sessionUserRoles,
} from 'containers/App/selectors';

import {
  newEntityRequest,
  updateEntityRequest,
  updateEntitiesRequest,
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
    const signedIn = yield select(isSignedIn);

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
  const signedIn = yield select(isSignedIn);
  if (signedIn) {
    const roleIds = yield select(sessionUserRoles);
    if (!(roleIds.indexOf(role) > -1
    || (role === USER_ROLES.MANAGER && roleIds.indexOf(USER_ROLES.ADMIN) > -1)
    || (role === USER_ROLES.CONTRIBUTOR && (roleIds.indexOf(USER_ROLES.MANAGER) > -1 || roleIds.indexOf(USER_ROLES.ADMIN) > -1))
    )) {
      yield put(push('/not-authorized'));
    }
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
// moved to UserPasswordReset
//
// export function* resetSaga(payload) {
//   const { password, passwordConfirmation } = payload.data;
//   try {
//     const location = yield select(selectLocation);
//     const query = location.get('query');
//     yield call(
//       apiRequest,
//       'put',
//       'auth/password',
//       {
//         password,
//         password_confirmation: passwordConfirmation,
//       },
//       {
//         client: query.get('client_id'),
//         reset_password: query.get('reset_password'),
//         'access-token': query.get('token'),
//         uid: query.get('uid'),
//         expiry: query.get('expiry'),
//       }
//     );
//     yield put(push('/login'));
//   } catch (err) {
//     err.response.json = yield err.response.json();
//     // yield put(authenticateError(err));
//   }
// }

export function* recoverSaga(payload) {
  // TODO messages
  const { email } = payload.data;
  try {
    yield call(apiRequest, 'post', 'auth/password', {
      email,
      redirect_url: `${window.location.origin}/resetpassword`, // TODO WIP
    });
    // forward to login
    yield put(push('/login'));
  } catch (err) {
    err.response.json = yield err.response.json();
  }
}

export function* authChangeSaga() {
  // forward to nextPathName if set
  const nextPathname = yield select(makeSelectPathnameOnAuthChange());
  if (nextPathname) {
    yield put(push(nextPathname));
  } else {
    // else forward to prevPathName if set
    const prevPathname = yield select(makeSelectPreviousPathname());
    if (prevPathname) {
      yield put(push(prevPathname));
    } else {
      // forward to home
      yield put(push('/'));
    }
  }
}

export function* logoutSaga() {
  try {
    yield call(apiRequest, 'delete', 'auth/sign_out');
    yield call(clearAuthValues);
    yield put(logoutSuccess());
    yield put(forwardOnAuthenticationChange());
    yield put(invalidateEntities());
  } catch (err) {
    yield call(clearAuthValues);
      // TODO ensure this is displayed
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

export function* updateConnectionsSaga({ data }) {
  // on the server
  const connectionsUpdated = yield call(updateAssociationsRequest, data.path, data.updates);
  // and on the client
  yield connectionsUpdated.map((connection) => connection.type === 'delete'
    ? put(deleteEntity(data.path, connection.id))
    : put(addEntity(data.path, connection.data))
  );
  // TODO: error handling
}

export function* createConnectionsSaga({ entityId, path, updates, keyPair }) {
  // make sure to use new entity id for full payload
  // we should have either the one (recommendation_id) or the other (measure_id)
  const updatesUpdated = updates;
  updatesUpdated.create = updatesUpdated.create.map((create) => ({
    [keyPair[0]]: create[keyPair[0]] || entityId,
    [keyPair[1]]: create[keyPair[1]] || entityId,
  }));

  yield call(updateConnectionsSaga, { data: { path, updates: updatesUpdated } });
}

export function* saveEntitySaga({ data }) {
  try {
    yield put(saveSending());
    // update entity attributes
    const entityUpdated = yield call(updateEntityRequest, data.path, data.entity);
    // and on the client
    yield put(updateEntity(data.path, {
      id: entityUpdated.data.id,
      attributes: entityUpdated.data.attributes,
    }));

    // update user-roles connections
    if (data.entity.userRoles) {
      yield call(updateConnectionsSaga, {
        data: {
          path: 'user_roles',
          updates: data.entity.userRoles,
        },
      });
    }

    // update user-category connections
    if (data.entity.userCategories) {
      yield call(updateConnectionsSaga, {
        data: {
          path: 'user_categories',
          updates: data.entity.userCategories,
        },
      });
    }

    // update recommendation-action connections
    if (data.entity.recommendationMeasures) {
      yield call(updateConnectionsSaga, {
        data: {
          path: 'recommendation_measures',
          updates: data.entity.recommendationMeasures,
        },
      });
    }

    // update action-indicatos connections
    if (data.entity.measureIndicators) {
      yield call(updateConnectionsSaga, {
        data: {
          path: 'measure_indicators',
          updates: data.entity.measureIndicators,
        },
      });
    }

    // update action-category connections
    if (data.entity.measureCategories) {
      yield call(updateConnectionsSaga, {
        data: {
          path: 'measure_categories',
          updates: data.entity.measureCategories,
        },
      });
    }

    // update recommendation-category connections
    if (data.entity.recommendationCategories) {
      yield call(updateConnectionsSaga, {
        data: {
          path: 'recommendation_categories',
          updates: data.entity.recommendationCategories,
        },
      });
    }

    yield put(saveSuccess());
    yield put(push(data.redirect));
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

    // update recommendation-category connections
    if (data.entity.recommendationCategories) {
      yield call(createConnectionsSaga, {
        entityId: entityCreated.data.id,
        path: 'recommendation_categories',
        updates: data.entity.recommendationCategories,
        keyPair: ['category_id', 'recommendation_id'],
      });
    }

    yield put(saveSuccess());
    yield put(push(`${data.redirect}/${entityCreated.data.id}`));
  } catch (error) {
    // console.error(error);
    yield put(saveError('An error occurred saving your data. Please review carefully and try again. '));
    yield put(invalidateEntities());
  }
}

// Batch update entity attributes
// WARNING untested =)
export function* updateEntitiesSaga({ data }) {
  try {
    yield put(saveSending());
    // on the server
    const entitiesUpdated = yield call(updateEntitiesRequest, data.path, data.entities);
    // // and on the client
    yield entitiesUpdated.map((entity) => put(updateEntity(data.path, entity.data)));
    yield put(saveSuccess());
  } catch (error) {
    yield put(saveError('An error occurred saving all or parts of your changes. Please review carefully and try again. '));
    yield put(invalidateEntities());
  }
}
export function* updateRouteQuerySaga({ query, extend = true }) {
  // TODO consider using history.js's updateQueryStringParams
  const location = yield select(selectLocation);
  // figure out new query
  // get old query or new query if not extending (replacing)
  const queryPrevious = extend ? location.get('query').toJS() : {};
  // and figure out new query
  const queryNext = query.reduce((q, param) => {
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
  yield put(push(path));
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

  yield takeLatest(SAVE_ENTITY, saveEntitySaga);
  yield takeLatest(NEW_ENTITY, newEntitySaga);
  yield takeEvery(UPDATE_CONNECTIONS, updateConnectionsSaga);
  yield takeEvery(UPDATE_ENTITIES, updateEntitiesSaga);

  yield takeEvery(LOAD_ENTITIES_IF_NEEDED, checkEntitiesSaga);
  yield takeLatest(REDIRECT_IF_NOT_PERMITTED, checkRoleSaga);
  yield takeEvery(UPDATE_ROUTE_QUERY, updateRouteQuerySaga);
  yield takeEvery(UPDATE_PATH, updatePathSaga);
}
