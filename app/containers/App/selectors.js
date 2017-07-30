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
import { regExMultipleWords } from 'utils/string';

import { USER_ROLES } from 'containers/App/constants';
import {
  prepareEntitySearchTarget,
  filterEntitiesByAttributes,
  attributesEqual,
} from 'utils/entities';

// high level state selects
const getRoute = (state) => state.get('route');
const getGlobal = (state) => state.get('global');
const getGlobalRequested = (state) => state.getIn(['global', 'requested']);

export const selectAuth = createSelector(
  getGlobal,
  (globalState) => globalState.get('auth').toJS()
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

const selectSessionUser = createSelector(
  getGlobal,
  (state) => state.get('user')
);

export const selectSessionUserId = createSelector(
  selectSessionUser,
  (sessionUser) =>
    sessionUser.get('attributes')
    && sessionUser.get('attributes').id.toString()
);

export const selectIsSignedIn = createSelector(
  selectSessionUser,
  (sessionUser) => sessionUser.get('isSignedIn')
);

// const makeSessionUserRoles = () => selectSessionUserRoles;
export const selectSessionUserRoles = createSelector(
  (state) => state,
  selectSessionUser,
  (state, sessionUser) => {
    if (sessionUser.get('attributes') && sessionUser.get('isSignedIn')) {
      const roles = selectEntitiesWhere(state, {
        path: 'user_roles',
        where: {
          user_id: sessionUser.get('attributes').id,
        },
      });
      return roles.map((role) => role.getIn(['attributes', 'role_id'])).toArray();
    }
    return Map();
  }
);

export const selectIsUserAdmin = createSelector(
  selectSessionUserRoles,
  (userRoles) => userRoles.includes(USER_ROLES.ADMIN)
);

export const selectIsUserManager = createSelector(
  selectSessionUserRoles,
  (userRoles) => userRoles.includes(USER_ROLES.MANAGER)
  || userRoles.includes(USER_ROLES.ADMIN)
);

export const selectIsUserContributor = createSelector(
  selectSessionUserRoles,
  (userRoles) => userRoles.includes(USER_ROLES.CONTRIBUTOR)
    || userRoles.includes(USER_ROLES.MANAGER)
    || userRoles.includes(USER_ROLES.ADMIN)
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
    (areReady, readyPath) => areReady && !!state.getIn(['global', 'ready', readyPath]),
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

const selectEntitiesAll = (state) => state.getIn(['global', 'entities']);

export const selectEntities = createSelector(
  selectEntitiesAll,
  (state, path) => path,
  (entities, path) => entities.get(path)
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
  (entities, query, searchAttributes) => {
    if (query) {
      try {
        const regex = new RegExp(regExMultipleWords(query), 'i');
        return entities.filter((entity) =>
          regex.test(prepareEntitySearchTarget(entity, searchAttributes, query.length))
        );
      } catch (e) {
        return entities;
      }
    }
    return entities;  // !search
  }
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
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => taxonomies
    .filter((taxonomy) => taxonomy.getIn(['attributes', 'tags_measures']))
    .map((taxonomy) => taxonomy.set(
      'categories',
      categories.filter((category) => attributesEqual(category.getIn(['attributes', 'taxonomy_id']), taxonomy.get('id')))
    ))
);

export const selectRecommendationTaxonomies = createSelector(
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => taxonomies
    .filter((taxonomy) => taxonomy.getIn(['attributes', 'tags_recommendations']))
    .map((taxonomy) => taxonomy.set(
      'categories',
      categories.filter((category) => attributesEqual(category.getIn(['attributes', 'taxonomy_id']), taxonomy.get('id')))
    ))
);

export const selectSdgTargetTaxonomies = createSelector(
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => taxonomies
    .filter((taxonomy) => taxonomy.getIn(['attributes', 'tags_sdgtargets']))
    .map((taxonomy) => taxonomy.set(
      'categories',
      categories.filter((category) => attributesEqual(category.getIn(['attributes', 'taxonomy_id']), taxonomy.get('id')))
    ))
);

export const selectUserTaxonomies = createSelector(
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => taxonomies
    .filter((taxonomy) => taxonomy.getIn(['attributes', 'tags_users']))
    .map((taxonomy) => taxonomy.set(
      'categories',
      categories.filter((category) => attributesEqual(category.getIn(['attributes', 'taxonomy_id']), taxonomy.get('id')))
    ))
);
