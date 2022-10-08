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
import { Map, List } from 'immutable';

import asArray from 'utils/as-array';
import asList from 'utils/as-list';
import { sortEntities } from 'utils/sort';

import { USER_ROLES, DB_TABLES } from 'themes/config';

import {
  filterEntitiesByAttributes,
  filterEntitiesByKeywords,
  entitiesSetCategoryIds,
  prepareTaxonomies,
  attributesEqual,
} from 'utils/entities';

import { PARAMS, PATHS } from './constants';

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

export const selectIsSigningIn = createSelector(
  selectIsSignedIn,
  selectSessionUserAttributes,
  (signedIn, user) => signedIn && !user
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
    .toList()
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

export const selectLocationQuery = createSelector(
  selectLocation,
  (location) => location.get && location.get('query')
);

// TODO consider replacing all "(state, locationQuery) => locationQuery" with selectLocationQuery
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
export const selectFrameworkListQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('fwx')
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

export const selectFrameworkQuery = createSelector(
  selectLocationQuery,
  (query) => (query && query.get('fw'))
      ? query.get('fw')
      : 'all'
);

// NEW performant way of selecting and querying entities
const selectEntitiesAll =
  (state) => state.getIn(['global', 'entities']);

export const selectEntities = createSelector(
  selectEntitiesAll,
  (state, path) => path,
  (entities, path) => entities.get(path)
);

export const selectFrameworks = createSelector(
  (state) => selectEntities(state, 'frameworks'),
  (entities) => entities
);
// use for testing single framework configuration
// && entities.filter((fw) => fw.get('id') === '1')

export const selectActiveFrameworks = createSelector(
  selectFrameworks,
  selectFrameworkQuery,
  (entities, fwQuery) => {
    if (
      entities &&
      entities.size > 1 &&
      fwQuery &&
      fwQuery !== 'all'
    ) {
      return entities.filter((fw) => attributesEqual(fwQuery, fw.get('id')));
    }
    return entities;
  }
);

export const selectFWRecommendations = createSelector(
  (state) => selectEntities(state, 'recommendations'),
  selectFrameworkQuery,
  (entities, framework) => {
    if (framework && framework !== 'all') {
      return entities.filter((rec) =>
        attributesEqual(rec.getIn(['attributes', 'framework_id']), framework));
    }
    return entities;
  }
);
// returns measures not associated or associated with current framework
export const selectFWMeasures = createSelector(
  (state) => selectEntities(state, 'measures'),
  selectFrameworkQuery,
  selectFWRecommendations,
  (state) => selectEntities(state, 'recommendation_measures'),
  (entities, framework, recs, recMeasures) => {
    if (recs && recMeasures && framework && framework !== 'all') {
      return entities.filter((measure) => {
        const recIds = recMeasures
          .filter((rm) => attributesEqual(rm.getIn(['attributes', 'measure_id']), measure.get('id')))
          .map((rm) => rm.getIn(['attributes', 'recommendation_id']));
        return recIds.size === 0 ||
          recIds.some((id) => !!recs.find((rec) => attributesEqual(rec.get('id'), id)));
      });
    }
    return entities;
  }
);

// get indicators for current framework
export const selectFWIndicators = createSelector(
  (state) => selectEntities(state, 'indicators'),
  selectFrameworkQuery,
  selectFWRecommendations,
  selectFWMeasures,
  (state) => selectEntities(state, 'recommendation_indicators'),
  (state) => selectEntities(state, 'measure_indicators'),
  (entities, framework, recs, measures, recIndicators, measureIndicators) => {
    if (recs && measures && recIndicators && measureIndicators && framework && framework !== 'all') {
      return entities.filter((indicator) => {
        const recIds = recIndicators
          .filter((ri) => attributesEqual(ri.getIn(['attributes', 'indicator_id']), indicator.get('id')))
          .map((ri) => ri.getIn(['attributes', 'recommendation_id']));
        const measureIds = measureIndicators
          .filter((mi) => attributesEqual(mi.getIn(['attributes', 'indicator_id']), indicator.get('id')))
          .map((mi) => mi.getIn(['attributes', 'measure_id']));
        return (recIds.size === 0 && measureIds.size === 0) ||
          recIds.some((id) => !!recs.find((rec) => attributesEqual(rec.get('id'), id))) ||
          measureIds.some((id) => !!measures.find((m) => attributesEqual(m.get('id'), id)));
      });
    }
    return entities;
  }
);

export const selectFWEntitiesAll = createSelector(
  selectEntitiesAll,
  selectFWRecommendations,
  selectFWMeasures,
  selectFWIndicators,
  (entities, recs, measures, indicators) =>
    entities
      .set('recommendations', recs)
      .set('measures', measures)
      .set('indicators', indicators)
);

export const selectTaxonomies = createSelector(
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'framework_taxonomies'),
  (taxonomies, fwTaxonomies) => taxonomies && fwTaxonomies &&
    taxonomies
      .map(
        (tax) => {
          const hasFramework = !!tax.getIn(['attributes', 'framework_id']);
          // connected to current framework
          const connectedToFramework = fwTaxonomies.some(
            (fwt) => attributesEqual(fwt.getIn(['attributes', 'taxonomy_id']), tax.get('id'))
          );
          // connectedFrameworks
          const frameworkIds = fwTaxonomies.reduce(
            (memo, fwt) => {
              if (attributesEqual(fwt.getIn(['attributes', 'taxonomy_id']), tax.get('id'))) {
                return memo.push(fwt.getIn(['attributes', 'framework_id']));
              }
              return memo;
            },
            List(),
          );
          return tax
            .setIn(['attributes', 'tags_recommendations'], hasFramework || connectedToFramework)
            .set('frameworkIds', frameworkIds);
        }
      )
    .filter(
      (tax) => tax.getIn(['attributes', 'tags_recommendations']) ||
        tax.getIn(['attributes', 'tags_measures']) ||
        tax.getIn(['attributes', 'tags_users'])
    )
);

export const selectFWTaxonomies = createSelector(
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'framework_taxonomies'),
  selectFrameworkQuery,
  (taxonomies, fwTaxonomies, framework) => taxonomies && fwTaxonomies &&
    taxonomies
      .map(
        (tax) => {
          const fwNotSet = !framework || framework === 'all';
          const hasFramework = !!tax.getIn(['attributes', 'framework_id'])
            && (
              fwNotSet ||
              attributesEqual(tax.getIn(['attributes', 'framework_id']), framework)
            );
          // connected to current framework
          const connectedToFramework = fwTaxonomies.some(
            (fwt) => attributesEqual(fwt.getIn(['attributes', 'taxonomy_id']), tax.get('id')) && (
              fwNotSet ||
              attributesEqual(fwt.getIn(['attributes', 'framework_id']), framework)
            )
          );
          // connectedFrameworks
          const frameworkIds = fwTaxonomies.reduce(
            (memo, fwt) => {
              if (attributesEqual(fwt.getIn(['attributes', 'taxonomy_id']), tax.get('id'))) {
                return memo.push(fwt.getIn(['attributes', 'framework_id']));
              }
              return memo;
            },
            List(),
          );
          return tax
            .setIn(['attributes', 'tags_recommendations'], hasFramework || connectedToFramework)
            .set('frameworkIds', frameworkIds);
        }
      )
    .filter(
      (tax) => tax.getIn(['attributes', 'tags_recommendations']) ||
        tax.getIn(['attributes', 'tags_measures']) ||
        tax.getIn(['attributes', 'tags_users'])
    )
);

export const selectTaxonomiesSorted = createSelector(
  selectTaxonomies,
  (taxonomies) => taxonomies && sortEntities(taxonomies, 'asc', 'priority', null, false)
);
export const selectFWTaxonomiesSorted = createSelector(
  selectFWTaxonomies,
  (taxonomies) => taxonomies && sortEntities(taxonomies, 'asc', 'priority', null, false)
);

export const selectEntity = createSelector(
  (state, { path }) => selectEntities(state, path),
  (state, { id }) => id,
  (entities, id) => id && entities.get(id.toString())
);
export const selectTaxonomy = createSelector(
  (state, id) => id,
  (state) => selectTaxonomies(state),
  (id, entities) => id && entities.get(id.toString())
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

// filter entities by attributes, using object
export const selectRecommendationsWhere = createSelector(
  (state, { where }) => where,
  selectFWRecommendations,
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);

// filter entities by attributes, using locationQuery
const selectRecommendationsWhereQuery = createSelector(
  selectAttributeQuery,
  selectFWRecommendations,
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);
export const selectRecommendationsSearchQuery = createSelector(
  selectRecommendationsWhereQuery,
  (state, { locationQuery }) => selectSearchQuery(state, locationQuery),
  (state, { searchAttributes }) => searchAttributes,
  (entities, query, searchAttributes) => query
    ? filterEntitiesByKeywords(entities, query, searchAttributes)
    : entities  // !search
);

// filter entities by attributes, using object
export const selectMeasuresWhere = createSelector(
  (state, { where }) => where,
  selectFWMeasures,
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);

// filter entities by attributes, using locationQuery
const selectMeasuresWhereQuery = createSelector(
  selectAttributeQuery,
  selectFWMeasures,
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);
export const selectMeasuresSearchQuery = createSelector(
  selectMeasuresWhereQuery,
  (state, { locationQuery }) => selectSearchQuery(state, locationQuery),
  (state, { searchAttributes }) => searchAttributes,
  (entities, query, searchAttributes) => query
    ? filterEntitiesByKeywords(entities, query, searchAttributes)
    : entities  // !search
);

// filter entities by attributes, using object
export const selectIndicatorsWhere = createSelector(
  (state, { where }) => where,
  selectFWIndicators,
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);

// filter entities by attributes, using locationQuery
const selectIndicatorsWhereQuery = createSelector(
  selectAttributeQuery,
  selectFWIndicators,
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities
);
export const selectIndicatorsSearchQuery = createSelector(
  selectIndicatorsWhereQuery,
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
  selectFWMeasures,
  selectFWIndicators,
  (measures, indicators) => Map()
    .set('measures', measures)
    .set('indicators', indicators)
);

export const selectIndicatorConnections = createSelector(
  selectFWMeasures,
  selectFWRecommendations,
  (measures, recommendations) => Map()
    .set('measures', measures)
    .set('recommendations', recommendations)
);

export const selectMeasureConnections = createSelector(
  selectFWRecommendations,
  selectFWIndicators,
  (recommendations, indicators) => Map()
    .set('recommendations', recommendations)
    .set('indicators', indicators)
);

export const selectMeasureTaxonomies = createSelector(
  (state, args) => args ? args.includeParents : true,
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (includeParents, taxonomies, categories) =>
    prepareTaxonomies(taxonomies, categories, 'tags_measures', includeParents)
);

export const selectRecommendationTaxonomies = createSelector(
  (state, args) => args ? args.includeParents : true,
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (includeParents, taxonomies, categories) =>
    prepareTaxonomies(taxonomies, categories, 'tags_recommendations', includeParents)
);

export const selectUserTaxonomies = createSelector(
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => prepareTaxonomies(taxonomies, categories, 'tags_users')
);

// get recommendations with category ids
export const selectRecommendationsCategorised = createSelector(
  selectFWRecommendations,
  (state) => selectEntities(state, 'recommendation_categories'),
  (entities, associations) =>
    entitiesSetCategoryIds(entities, 'recommendation_id', associations)
);

export const selectMeasuresCategorised = createSelector(
  selectFWMeasures,
  (state) => selectEntities(state, 'measure_categories'),
  (entities, associations) =>
    entitiesSetCategoryIds(entities, 'measure_id', associations)
);

export const selectViewRecommendationFrameworkId = createSelector(
  (state, id) => selectEntity(state, { path: 'recommendations', id }),
  selectCurrentPathname,
  (entity, pathname) => {
    if (
      pathname.startsWith(PATHS.RECOMMENDATIONS) &&
      entity &&
      entity.getIn(['attributes', 'framework_id'])
    ) {
      return entity.getIn(['attributes', 'framework_id']).toString();
    }
    return null;
  }

);
