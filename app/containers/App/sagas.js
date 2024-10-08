/**
 * Gets the entities from server
 */

import {
  call, put, select, takeLatest, takeEvery, race, take, all,
} from 'redux-saga/effects';
import { push, replace, goBack } from 'react-router-redux';
import { reduce, keyBy } from 'lodash/collection';
import { without } from 'lodash/array';
import { fromJS } from 'immutable';

import asArray from 'utils/as-array';
import {
  hasRoleRequired,
  replaceUnauthorised,
  replaceIfNotSignedIn,
} from 'utils/redirects';


import {
  LOAD_ENTITIES_IF_NEEDED,
  REDIRECT_IF_NOT_PERMITTED,
  REDIRECT_NOT_PERMITTED,
  SAVE_ENTITY,
  SAVE_MULTIPLE_ENTITIES,
  NEW_ENTITY,
  NEW_MULTIPLE_ENTITIES,
  DELETE_ENTITY,
  DELETE_MULTIPLE_ENTITIES,
  AUTHENTICATE,
  AUTHENTICATE_AZURE,
  LOGOUT,
  VALIDATE_TOKEN,
  INVALIDATE_ENTITIES,
  SAVE_CONNECTIONS,
  UPDATE_ROUTE_QUERY,
  AUTHENTICATE_FORWARD,
  UPDATE_PATH,
  // RESET_PASSWORD,
  RECOVER_PASSWORD,
  CLOSE_ENTITY,
  DISMISS_QUERY_MESSAGES,
  ROUTES,
  PARAMS,
  SET_FRAMEWORK,
  SET_LOAD_ARCHIVED,
  SET_LOAD_NONCURRENT,
  OPEN_BOOKMARK,
} from 'containers/App/constants';

import {
  ENDPOINTS,
  KEYS,
  DB_TABLES,
  DB_TABLES_CURRENT,
  DB_TABLES_ARCHIVED,
  ENABLE_AZURE,
  KEEP_QUERY_ARGS,
  SETTINGS,
} from 'themes/config';

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
  updatePath,
  initializeSettings,
} from 'containers/App/actions';

import {
  selectCurrentPathname,
  selectPreviousPathname,
  selectRedirectOnAuthSuccessPath,
  selectRequestedAt,
  selectIsSignedIn,
  selectLocation,
  selectSessionUserRoles,
  selectIsAuthenticating,
  selectLoadArchivedQuery,
  selectLoadNonCurrentQuery,
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
  if (DB_TABLES.indexOf(payload.path) > -1) {
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
        if (!signedIn && payload.path === 'users') {
          // store empty response so the app wont wait for the results
          yield put(entitiesLoaded({}, payload.path, Date.now()));
        } else {
          // Call the API, cancel on invalidate
          let query = {};
          // if (payload.includeArchive) {
          const includeArchive = yield select(selectLoadArchivedQuery);
          const includeNonCurrent = yield select(selectLoadNonCurrentQuery);
          // only apply to relevant tables
          if (!includeArchive && DB_TABLES_ARCHIVED.indexOf(payload.path) > -1) {
            query = {
              ...query,
              include_archive: 'false',
            };
          }
          if (!includeNonCurrent && DB_TABLES_CURRENT.indexOf(payload.path) > -1) {
            query = {
              ...query,
              current_only: 'true',
            };
          }
          const { response } = yield race({
            response: call(
              apiRequest,
              'get',
              payload.path,
              query,
              // {
              //   // include_archive: 'false',
              //   // current_only: 'true',
              // },
            ),
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
}
/**
 * Check if user is authorized
 */
export function* checkRoleSaga({ role }) {
  const signedIn = yield select(selectIsSignedIn);
  if (!signedIn) {
    const authenticating = yield select(selectIsAuthenticating);
    if (!authenticating) {
      const redirectOnAuthSuccess = yield select(selectCurrentPathname);
      yield put(replaceIfNotSignedIn(redirectOnAuthSuccess, replace));
    }
  } else {
    const roleIds = yield select(selectSessionUserRoles);
    if (!hasRoleRequired(roleIds, role)) {
      yield put(replaceUnauthorised(replace));
    }
  }
}
/**
 * Check if user is authorized
 */
export function* redirectNotPermittedSaga() {
  yield put(replaceUnauthorised(replace));
}

export function* authenticateSaga(payload) {
  const { password, email } = payload.data;
  try {
    yield put(authenticateSending());
    const response = yield call(apiRequest, 'post', ENDPOINTS.SIGN_IN, { email, password });
    yield put(authenticateSuccess(response.data));
    yield put(invalidateEntities()); // important invalidate before forward to allow for reloading of entities
    yield put(forwardOnAuthenticationChange());
  } catch (err) {
    err.response.json = yield err.response.json();
    yield put(authenticateError(err));
  }
}

export function* authenticateWithAzureSaga() {
  // let's get the path for successful redirects
  const redirectPathname = yield select(selectRedirectOnAuthSuccessPath);
  try {
    yield put(authenticateSending());
    // figure out success query and location
    const querySuccess = {
      [PARAMS.REDIRECT_ON_AUTH_SUCCESS]: redirectPathname,
    };
    const querySuccessString = getNextQueryString(querySuccess);
    const successLocation = `${window.location.origin}${ROUTES.LOGIN_OAUTH_SUCCESS}?${querySuccessString}`;
    let location = `${ENDPOINTS.API}/${ENDPOINTS.SIGN_IN_AZURE}?resource_class=User`;
    location = `${location}&auth_origin_url=${encodeURIComponent(successLocation)}`;
    window.location.href = location;
  } catch (err) {
    if (err.response) {
      err.response.json = yield err.response.json();
      yield put(authenticateError(err));
    }
  }
}

export function* recoverSaga(payload) {
  const { email } = payload.data;
  try {
    yield put(recoverSending());
    yield call(apiRequest, 'post', ENDPOINTS.PASSWORD, {
      email,
      redirect_url: `${window.location.origin}${ROUTES.RESET_PASSWORD}`,
    });
    yield put(recoverSuccess());
    // forward to login
    yield put(updatePath(
      ROUTES.LOGIN,
      {
        replace: true,
        query: { info: PARAMS.RECOVER_SUCCESS },
      }
    ));
  } catch (err) {
    err.response.json = yield err.response.json();
    yield put(recoverError(err));
  }
}

export function* authChangeSaga() {
  const redirectPathname = yield select(selectRedirectOnAuthSuccessPath);
  if (redirectPathname) {
    yield put(updatePath(redirectPathname, { replace: true }));
  } else {
    // forward to home
    yield put(updatePath('/', { replace: true }));
  }
  yield put(initializeSettings(fromJS(SETTINGS)));
}

export function* logoutSaga() {
  try {
    yield call(apiRequest, 'delete', ENDPOINTS.SIGN_OUT);
    yield call(clearAuthValues);
    yield put(logoutSuccess());
    if (ENABLE_AZURE) {
      // forward to home to prevent second login
      yield put(updatePath('/', { replace: true }));
    } else {
      yield put(updatePath(ROUTES.LOGIN, { replace: true }));
    }
  } catch (err) {
    yield call(clearAuthValues);
    yield put(authenticateError(err));
  }
}

export function* validateTokenSaga() {
  try {
    const {
      [KEYS.UID]: uid,
      [KEYS.CLIENT]: client,
      [KEYS.ACCESS_TOKEN]: accessToken,
    } = yield getAuthValues();

    if (uid && client && accessToken) {
      yield put(authenticateSending());
      const response = yield call(
        apiRequest,
        'get',
        ENDPOINTS.VALIDATE_TOKEN, {
          [KEYS.UID]: uid,
          [KEYS.CLIENT]: client,
          [KEYS.ACCESS_TOKEN]: accessToken,
        }
      );
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


function stampPayload(payload, type) {
  return Object.assign(payload, {
    timestamp: `${Date.now()}-${Math.random().toString(36).slice(-8)}`,
    type,
  });
}


function* createConnectionsSaga({
  entityId, path, updates, keyPair,
}) {
  // make sure to use new entity id for full payload
  // we should have either the one (recommendation_id) or the other (measure_id)
  const updatesUpdated = updates;
  updatesUpdated.create = updatesUpdated.create.map((create) => ({
    [keyPair[0]]: create[keyPair[0]] || entityId,
    [keyPair[1]]: create[keyPair[1]] || entityId,
  }));

  yield call(saveConnectionsSaga, { data: { path, updates: updatesUpdated } });
}

export function* saveEntitySaga({ data }, updateClient = true, multiple = false) {
  const dataTS = stampPayload(data, 'save');
  try {
    yield put(saveSending(dataTS));

    if (!data.entity.skipAttributes) {
      // update entity attributes
      const entityUpdated = yield call(updateEntityRequest, data.path, data.entity);
      // and on the client
      if (updateClient) {
        yield put(updateEntity(data.path, {
          id: entityUpdated.data.id,
          attributes: entityUpdated.data.attributes,
        }));
      }
    }
    if (!multiple) {
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
      // update recommendation-indicator connections
      if (data.entity.recommendationIndicators) {
        yield call(saveConnectionsSaga, {
          data: {
            path: 'recommendation_indicators',
            updates: data.entity.recommendationIndicators,
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

      // update recommendation-category connections
      if (data.entity.recommendationCategories) {
        yield call(saveConnectionsSaga, {
          data: {
            path: 'recommendation_categories',
            updates: data.entity.recommendationCategories,
          },
        });
      }
    }
    yield put(saveSuccess(dataTS));
    if (!multiple && data.redirect) {
      yield put(updatePath(data.redirect, { replace: true }));
    }
    if (updateClient && data.invalidateEntitiesOnSuccess) {
      yield put(invalidateEntities(data.invalidateEntitiesOnSuccess));
    }
  } catch (err) {
    err.response.json = yield err.response.json();
    yield put(saveError(err, dataTS));
    if (updateClient) {
      yield put(invalidateEntities(data.path));
    }
  }
}

export function* saveMultipleEntitiesSaga({ path, data }) {
  const updateClient = data && data.length <= 20;
  yield all(data.map(
    (datum) => call(
      saveEntitySaga,
      { data: datum },
      updateClient, // update client for small batch jobs
      true, // multiple
    )
  ));
  if (!updateClient) {
    yield put(invalidateEntities(path));
  }
}

export function* deleteEntitySaga({ data }, updateClient = true, multiple = false) {
  const dataTS = stampPayload(data, 'delete');
  try {
    yield put(deleteSending(dataTS));
    yield call(deleteEntityRequest, data.path, data.id);
    if (!multiple && data.redirect !== false) {
      yield put(updatePath(
        `/${data.redirect || data.path}`,
        { replace: true },
      ));
    }
    if (updateClient) {
      yield put(removeEntity(data.path, data.id));
    }
    yield put(deleteSuccess(dataTS));
  } catch (err) {
    err.response.json = yield err.response.json();
    yield put(deleteError(err, dataTS));
    if (updateClient) {
      yield put(invalidateEntities(data.path));
    }
  }
}

export function* deleteMultipleEntitiesSaga({ path, data }) {
  const updateClient = data && data.length <= 20;
  yield all(data.map(
    (datum) => call(
      deleteEntitySaga,
      { data: datum },
      updateClient, // do not update client
      true, // multiple
    )
  ));
  if (!updateClient) {
    yield put(invalidateEntities(path));
  }
}

export function* newEntitySaga({ data }, updateClient = true, multiple = false) {
  const dataTS = stampPayload(data, 'new');
  try {
    yield put(saveSending(dataTS));
    // update entity attributes
    // on the server
    const entityCreated = yield call(newEntityRequest, data.path, data.entity.attributes);

    if (!data.createAsGuest) {
      if (updateClient) {
        yield put(addEntity(data.path, entityCreated.data));
      }
      if (!multiple) {
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
        // update sdgtarget-indicator connections
        if (data.entity.recommendationIndicators) {
          yield call(createConnectionsSaga, {
            entityId: entityCreated.data.id,
            path: 'recommendation_indicators',
            updates: data.entity.recommendationIndicators,
            keyPair: ['indicator_id', 'recommendation_id'],
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
      }
    }
    yield put(saveSuccess(dataTS));
    if (data.onSuccess) {
      data.onSuccess();
    }
    if (!multiple && data.redirect) {
      if (data.createAsGuest) {
        yield put(updatePath(
          data.redirect,
          {
            query: { info: 'createdAsGuest', infotype: data.path },
            replace: true,
          }
        ));
      } else {
        yield put(updatePath(
          `${data.redirect}/${entityCreated.data.id}`,
          { replace: true },
        ));
      }
    }
    if (updateClient && data.invalidateEntitiesOnSuccess) {
      yield put(invalidateEntities(data.invalidateEntitiesOnSuccess));
    }
  } catch (err) {
    err.response.json = yield err.response.json();
    yield put(saveError(err, dataTS));
    if (updateClient) {
      yield put(invalidateEntities(data.path));
    }
  }
}

export function* newMultipleEntitiesSaga({ path, data }) {
  const updateClient = data && data.length <= 20;
  yield all(data.map(
    (datum) => call(
      newEntitySaga,
      { data: datum },
      updateClient, // do not update client
      true, // multiple
    )
  ));
  if (!updateClient) {
    yield put(invalidateEntities(path));
  }
}

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

const getNextQuery = (query, extend, location) => {
  // figure out new query
  // get old query or new query if not extending (replacing)
  const queryPrevious = extend
    ? location.get('query').toJS()
    : location.get('query').filter((val, key) => key === 'fw').toJS();

  // and figure out new query
  return asArray(query).reduce((q, param) => {
    const queryUpdated = q;
    // if arg already set and not replacing
    if (queryUpdated[param.arg] && !param.replace) {
      // if multiple values set
      if (Array.isArray(queryUpdated[param.arg])) {
        // add if not already present
        if (param.add && queryUpdated[param.arg].indexOf(param.value.toString()) === -1) {
          queryUpdated[param.arg].push(param.value);
        // remove if present
        } else if (extend && param.remove && param.value && queryUpdated[param.arg].indexOf(param.value.toString()) > -1) {
          queryUpdated[param.arg] = without(queryUpdated[param.arg], param.value.toString());
          // convert to single value if only one value left
          if (queryUpdated[param.arg].length === 1) {
            /* eslint-disable prefer-destructuring */
            queryUpdated[param.arg] = queryUpdated[param.arg][0];
            /* eslint-enable prefer-destructuring */
          }
        }
      // if single value set
      // add if not already present and convert to array
      } else if (param.value && param.add && queryUpdated[param.arg] !== param.value.toString()) {
        queryUpdated[param.arg] = [queryUpdated[param.arg], param.value];
      // remove if present
      } else if (extend && param.remove && (!param.value || (param.value && queryUpdated[param.arg] === param.value.toString()))) {
        delete queryUpdated[param.arg];
      }
    // if set and removing
    } else if (queryUpdated[param.arg] && param.remove) {
      delete queryUpdated[param.arg];
    // if not set or replacing with new value
    } else if (typeof param.value !== 'undefined' && !param.remove) {
      queryUpdated[param.arg] = param.value;
    }
    return queryUpdated;
  }, queryPrevious);
};

// convert to string
export const getNextQueryString = (queryNext) => reduce(queryNext, (result, value, key) => {
  let params;
  if (Array.isArray(value)) {
    params = value.reduce((memo, val) => `${memo}${memo.length > 0 ? '&' : ''}${key}=${encodeURIComponent(val)}`, '');
  } else {
    params = `${key}=${encodeURIComponent(value)}`;
  }
  return `${result}${result.length > 0 ? '&' : ''}${params}`;
}, '');

export function* updateRouteQuerySaga({ query, extend = true }) {
  const location = yield select(selectLocation);
  yield put(updatePath(
    location.get('pathname'),
    {
      query,
      extend,
      replace: true,
    },
  ));
}

export function* setFrameworkSaga({ framework }) {
  const location = yield select(selectLocation);
  const queryNext = getNextQuery(
    {
      arg: 'fw',
      value: framework,
    },
    true, // extend
    location,
  );

  yield put(replace(`${location.get('pathname')}?${getNextQueryString(queryNext)}`));
}
export function* setLoadArchivedSaga({ loadArchived }) {
  const location = yield select(selectLocation);

  yield put(updatePath(
    location.get('pathname'),
    {
      query: [
        {
          arg: 'loadArchived',
          value: loadArchived || null,
          remove: !loadArchived,
        },
      ],
      extend: true,
    },
  ));
  yield put(invalidateEntities()); // important invalidate to allow for reloading of entities
}
export function* setLoadNonCurrentSaga({ loadNonCurrent }) {
  const location = yield select(selectLocation);

  yield put(updatePath(
    location.get('pathname'),
    {
      query: [
        {
          arg: 'loadNonCurrent',
          value: loadNonCurrent || null,
          remove: !loadNonCurrent,
        },
      ],
      extend: true,
    },
  ));
  yield put(invalidateEntities()); // important invalidate to allow for reloading of entities
}

export function* openBookmarkSaga({ bookmark }) {
  const path = bookmark.getIn(['attributes', 'view', 'path']);
  const queryString = getNextQueryString(
    bookmark.getIn(['attributes', 'view', 'query']).toJS(),
  );
  yield put(push(`${path}?${queryString}`));
}

export function* dismissQueryMessagesSaga() {
  const location = yield select(selectLocation);
  yield put(updatePath(
    location.get('pathname'),
    {
      query: [
        { arg: 'info', remove: true },
        { arg: 'warning', remove: true },
        { arg: 'error', remove: true },
      ],
      extend: true,
      replace: true,
    },
  ));
}

export function* updatePathSaga({ path, args }) {
  let relativePath = path.startsWith('/') ? path : `/${path}`;
  let query = (args && args.query) || [];
  // keep query args from path (as is needed for login redirect)
  if (relativePath.indexOf('?') > -1) {
    const [p, search] = relativePath.split('?');
    relativePath = p;
    let searchParams = Object.fromEntries(new URLSearchParams(search));
    searchParams = Object.keys(searchParams).reduce(
      (memo, key) => ([
        ...memo,
        { arg: key, value: searchParams[key] },
      ]),
      [],
    );
    query = [
      ...query,
      ...searchParams,
    ];
  }
  const location = yield select(selectLocation);

  let queryNext = {};
  // update query based on provided query args
  if (query) {
    queryNext = getNextQuery(query, args ? args.extend : false, location);
  }
  // optionally keep all previous query args
  if (args && args.keepQuery) {
    queryNext = {
      ...queryNext,
      ...location.get('query').toJS(),
    };
  } else {
    // otherwise keep "specific args" incl framework (unless explicitly removed)
    const argsRemove = query
      ? asArray(query).filter((item) => item.remove).map((item) => item.arg)
      : [];
    const queryKeep = location.get('query').filter(
      (val, key) => KEEP_QUERY_ARGS.indexOf(key) > -1 && argsRemove.indexOf(key) === -1
    ).toJS();
    queryNext = {
      ...queryNext,
      ...queryKeep,
    };
  }
  // convert to string
  const queryNextString = getNextQueryString(queryNext);
  const nextPath = `${relativePath}?${queryNextString}`;
  if (args && args.replace) {
    yield put(replace(nextPath));
  } else {
    yield put(push(nextPath));
  }
}

export function* closeEntitySaga({ path }) {
  // the close icon is to function like back if possible, otherwise go to default path provided
  const previousPath = yield select(selectPreviousPathname);
  const currentPath = yield select(selectCurrentPathname);
  const isPreviousValid = previousPath.indexOf('/edit') > -1
    || previousPath.indexOf('/new') > -1;
  yield put(
    !isPreviousValid && previousPath && (previousPath !== currentPath)
      ? goBack()
      : updatePath(path || '/')
  );
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* rootSaga() {
  // console.log('calling rootSaga');)
  yield takeLatest(VALIDATE_TOKEN, validateTokenSaga);

  yield takeLatest(AUTHENTICATE, authenticateSaga);
  yield takeLatest(AUTHENTICATE_AZURE, authenticateWithAzureSaga);
  yield takeLatest(RECOVER_PASSWORD, recoverSaga);
  yield takeLatest(LOGOUT, logoutSaga);
  yield takeLatest(AUTHENTICATE_FORWARD, authChangeSaga);

  yield takeEvery(SAVE_ENTITY, saveEntitySaga);
  yield takeEvery(SAVE_MULTIPLE_ENTITIES, saveMultipleEntitiesSaga);
  yield takeEvery(NEW_ENTITY, newEntitySaga);
  yield takeEvery(NEW_MULTIPLE_ENTITIES, newMultipleEntitiesSaga);
  yield takeEvery(DELETE_ENTITY, deleteEntitySaga);
  yield takeEvery(DELETE_MULTIPLE_ENTITIES, deleteMultipleEntitiesSaga);
  yield takeEvery(SAVE_CONNECTIONS, saveConnectionsSaga);

  yield takeEvery(LOAD_ENTITIES_IF_NEEDED, checkEntitiesSaga);
  yield takeLatest(REDIRECT_IF_NOT_PERMITTED, checkRoleSaga);
  yield takeLatest(REDIRECT_NOT_PERMITTED, redirectNotPermittedSaga);
  yield takeEvery(UPDATE_ROUTE_QUERY, updateRouteQuerySaga);
  yield takeEvery(UPDATE_PATH, updatePathSaga);
  yield takeEvery(SET_FRAMEWORK, setFrameworkSaga);
  yield takeEvery(SET_LOAD_ARCHIVED, setLoadArchivedSaga);
  yield takeEvery(SET_LOAD_NONCURRENT, setLoadNonCurrentSaga);
  yield takeEvery(OPEN_BOOKMARK, openBookmarkSaga);
  yield takeEvery(DISMISS_QUERY_MESSAGES, dismissQueryMessagesSaga);

  yield takeEvery(CLOSE_ENTITY, closeEntitySaga);
}
