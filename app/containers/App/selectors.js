/**
 * The global state selectors
 *
 * use the makeSelector () => createSelector pattern when you want a selector that
 * doesn't take arguments, but can have its own cache between components
 *
 * otherwise use straight createSelector
 * https://github.com/react-boilerplate/react-boilerplate/pull/1205#issuecomment-274319934
 *
 */
import { createSelector } from 'reselect';
import { reduce } from 'lodash/collection';
import { Map } from 'immutable';

import asArray from 'utils/as-array';
import asList from 'utils/as-list';
import { sortEntities } from 'utils/sort';

import { USER_ROLES, DB_TABLES } from 'themes/config';
import { PARAMS } from 'containers/App/constants';

import {
  filterEntitiesByAttributes,
  filterEntitiesByKeywords,
  entitySetCategoryIds,
  prepareTaxonomies,
} from 'utils/entities';

// high level state selects
const getRoute = (state) => state.get('route');
const getGlobal = (state) => state.get('global');
const getGlobalRequested = (state) => state.getIn(['global', 'requested']);

export const selectNewEntityModal = createSelector(
  getGlobal,
  (globalState) => globalState.get('newEntityModal')
);

export const selectIsAuthenticating = createSelector(
  getGlobal,
  (globalState) => globalState.getIn(['auth', 'sending'])
);

export const selectReadyUserRoles = (state) =>
  !!state.getIn(['global', 'ready', 'user_roles']);

export const selectReadyForAuthCheck = createSelector(
  selectIsAuthenticating,
  selectReadyUserRoles,
  (isAuthenticating, rolesReady) => !isAuthenticating && rolesReady
);

export const selectSessionUser = createSelector(
  getGlobal,
  (state) => state.get('user')
);

export const selectIsSignedIn = createSelector(
  selectSessionUser,
  (sessionUser) => sessionUser && sessionUser.get('isSignedIn')
);

export const selectSessionUserAttributes = createSelector(
  selectSessionUser,
  (sessionUser) => sessionUser && sessionUser.get('attributes')
);

export const selectSessionUserId = createSelector(
  selectSessionUserAttributes,
  (sessionUserAttributes) => sessionUserAttributes && sessionUserAttributes.id.toString()
);

// const makeSessionUserRoles = () => selectSessionUserRoles;
export const selectSessionUserRoles = createSelector(
  (state) => state,
  selectIsSignedIn,
  selectSessionUserId,
  (state, isSignedIn, sessionUserId) => isSignedIn && sessionUserId
    ? selectEntitiesWhere(state, {
      path: 'user_roles',
      where: { user_id: sessionUserId },
    })
    .map((role) => role.getIn(['attributes', 'role_id']))
    .toArray()
    : Map()
);


export const selectIsUserAdmin = createSelector(
  selectSessionUserRoles,
  (userRoles) => userRoles.includes(USER_ROLES.ADMIN.value)
);

export const selectIsUserManager = createSelector(
  selectSessionUserRoles,
  (userRoles) => userRoles.includes(USER_ROLES.MANAGER.value)
  || userRoles.includes(USER_ROLES.ADMIN.value)
);

export const selectIsUserContributor = createSelector(
  selectSessionUserRoles,
  (userRoles) => userRoles.includes(USER_ROLES.CONTRIBUTOR.value)
    || userRoles.includes(USER_ROLES.MANAGER.value)
    || userRoles.includes(USER_ROLES.ADMIN.value)
);


export const selectHasUserRole = createSelector(
  selectIsUserAdmin,
  selectIsUserManager,
  selectIsUserContributor,
  (isAdmin, isManager, isContributor) => ({
    [USER_ROLES.ADMIN.value]: isAdmin,
    [USER_ROLES.MANAGER.value]: isManager,
    [USER_ROLES.CONTRIBUTOR.value]: isContributor,
  })
);

export const selectSessionUserHighestRoleId = createSelector(
  selectSessionUserRoles,
  (userRoles) => {
    if (userRoles.includes(USER_ROLES.ADMIN.value)) {
      return USER_ROLES.ADMIN.value;
    }
    if (userRoles.includes(USER_ROLES.MANAGER.value)) {
      return USER_ROLES.MANAGER.value;
    }
    if (userRoles.includes(USER_ROLES.CONTRIBUTOR.value)) {
      return USER_ROLES.CONTRIBUTOR.value;
    }
    return USER_ROLES.DEFAULT.value;
  }
);


// makeSelectLocationState expects a plain JS object for the routing state
export const makeSelectLocationState = () => {
  let prevRoutingState;
  let prevRoutingStateJS;

  return (state) => {
    const routingState = state.get('route'); // or state.route

    if (!routingState.equals(prevRoutingState)) {
      prevRoutingState = routingState;
      prevRoutingStateJS = routingState.toJS();
    }

    return prevRoutingStateJS;
  };
};

export const selectCurrentPathname = createSelector(
  getRoute,
  (routeState) => {
    try {
      return routeState.getIn(['locationBeforeTransitions', 'pathname']);
    } catch (error) {
      return null;
    }
  }
);

export const selectRedirectOnAuthSuccessPath = createSelector(
  getRoute,
  (routeState) => {
    try {
      return routeState.getIn(['locationBeforeTransitions', 'query', PARAMS.REDIRECT_ON_AUTH_SUCCESS]);
    } catch (error) {
      return null;
    }
  }
);

export const selectQueryMessages = createSelector(
  getRoute,
  (routeState) => {
    try {
      return ({
        info: routeState.getIn(['locationBeforeTransitions', 'query', 'info']),
        warning: routeState.getIn(['locationBeforeTransitions', 'query', 'warning']),
        error: routeState.getIn(['locationBeforeTransitions', 'query', 'error']),
        infotype: routeState.getIn(['locationBeforeTransitions', 'query', 'infotype']),
      });
    } catch (error) {
      return null;
    }
  }
);

export const selectPreviousPathname = createSelector(
  getRoute,
  (routeState) => {
    try {
      return routeState.getIn(['locationBeforeTransitions', 'pathnamePrevious']);
    } catch (error) {
      return null;
    }
  }
);

export const selectRequestedAt = createSelector(
  getGlobalRequested,
  (state, { path }) => path,
  (requested, path) => requested.get(path)
);

export const selectReady = (state, { path }) =>
  reduce(asArray(path),
    (areReady, readyPath) => areReady && (
      !!state.getIn(['global', 'ready', readyPath])
      || DB_TABLES.indexOf(readyPath) === -1
    ),
    true
  );

export const selectLocation = createSelector(
  getRoute,
  (routeState) => {
    try {
      return routeState.get('locationBeforeTransitions');
    } catch (error) {
      return null;
    }
  }
);

const selectWhereQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('where')
);

export const selectAttributeQuery = createSelector(
  (state, { locationQuery }) => selectWhereQuery(state, locationQuery),
  (whereQuery) => whereQuery &&
    asList(whereQuery).reduce((memo, where) => {
      const attrValue = where.split(':');
      return Object.assign(memo, { [attrValue[0]]: attrValue[1] });
    }, {})
);

export const selectWithoutQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('without')
);

export const selectCategoryQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('cat')
);

export const selectConnectionQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('connected')
);

export const selectConnectedCategoryQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('catx')
);

export const selectSearchQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('search')
);

export const selectExpandQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('expand')
    ? parseInt(locationQuery.get('expand'), 10)
    : 0
);

export const selectSortOrderQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('order')
);

export const selectSortByQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('sort')
);

// NEW performant way of selecting and querying entities

export const selectEntitiesAll = (state) => state.getIn(['global', 'entities']);

export const selectEntities = createSelector(
  selectEntitiesAll,
  (state, path) => path,
  (entities, path) => entities.get(path)
);

export const selectTaxonomiesSorted = createSelector(
  (state) => selectEntities(state, 'taxonomies'),
  (taxonomies) => taxonomies && sortEntities(taxonomies, 'asc', 'priority', null, false)
);

export const selectEntity = createSelector(
  (state, { path }) => selectEntities(state, path),
  (state, { id }) => id,
  (entities, id) => entities.get(id.toString())
);

// filter entities by attributes, using object
export const selectEntitiesWhere = createSelector(
  (state, { where }) => where,
  (state, { path }) => selectEntities(state, path),
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);

// filter entities by attributes, using locationQuery
const selectEntitiesWhereQuery = createSelector(
  selectAttributeQuery,
  (state, { path }) => selectEntities(state, path),
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);

export const selectEntitiesSearchQuery = createSelector(
  selectEntitiesWhereQuery,
  (state, { locationQuery }) => selectSearchQuery(state, locationQuery),
  (state, { searchAttributes }) => searchAttributes,
  (entities, query, searchAttributes) => query
    ? filterEntitiesByKeywords(entities, query, searchAttributes)
    : entities  // !search
);

export const selectUserConnections = createSelector(
  (state) => selectEntities(state, 'roles'),
  (roles) => Map().set('roles', roles)
);

export const selectRecommendationConnections = createSelector(
  (state) => selectEntities(state, 'measures'),
  (measures) => Map().set('measures', measures)
);

export const selectSdgTargetConnections = createSelector(
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'indicators'),
  (measures, indicators) => Map()
    .set('measures', measures)
    .set('indicators', indicators)
);

export const selectIndicatorConnections = createSelector(
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'sdgtargets'),
  (measures, sdgtargets) => Map()
    .set('measures', measures)
    .set('sdgtargets', sdgtargets)
);

export const selectMeasureConnections = createSelector(
  (state) => selectEntities(state, 'recommendations'),
  (state) => selectEntities(state, 'indicators'),
  (state) => selectEntities(state, 'sdgtargets'),
  (recommendations, indicators, sdgtargets) => Map()
    .set('recommendations', recommendations)
    .set('indicators', indicators)
    .set('sdgtargets', sdgtargets)
);

export const selectMeasureTaxonomies = createSelector(
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => prepareTaxonomies(taxonomies, categories, 'tags_measures')
);

export const selectRecommendationTaxonomies = createSelector(
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => prepareTaxonomies(taxonomies, categories, 'tags_recommendations')
);

export const selectSdgTargetTaxonomies = createSelector(
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => prepareTaxonomies(taxonomies, categories, 'tags_sdgtargets')
);

export const selectUserTaxonomies = createSelector(
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => prepareTaxonomies(taxonomies, categories, 'tags_users')
);

export const selectRecommendationsCategorised = createSelector(
  (state) => selectEntities(state, 'recommendations'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (entities, categories) =>
    entities && entities.map((entity) => entitySetCategoryIds(entity, 'recommendation_id', categories))
);

export const selectSdgTargetsCategorised = createSelector(
  (state) => selectEntities(state, 'sdgtargets'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (entities, categories) =>
    entities && entities.map((entity) => entitySetCategoryIds(entity, 'sdgtarget_id', categories))
);

export const selectMeasuresCategorised = createSelector(
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'measure_categories'),
  (entities, categories) =>
    entities && entities.map((entity) => entitySetCategoryIds(entity, 'measure_id', categories))
);
