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

import {
  API,
  USER_ROLES,
  DB_TABLES,
  CATEGORY_ADMIN_MIN_ROLE,
  CURRENT_TAXONOMY_IDS,
} from 'themes/config';

import {
  filterEntitiesByAttributes,
  filterEntitiesByKeywords,
  entitiesSetCategoryIds,
  prepareTaxonomies,
  getTaxCategories,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';
import { PARAMS, ROUTES } from './constants';

// high level state selects
const getRoute = (state) => state.get('route');
const getGlobal = (state) => state.get('global');
const getGlobalRequested = (state) => state.getIn(['global', 'requested']);

export const selectCategories = (state) => selectEntitiesAll(state).get(API.CATEGORIES);
const selectRecommendationsRaw = (state) => selectEntitiesAll(state).get(API.RECOMMENDATIONS);
export const selectTaxonomiesRaw = (state) => selectEntitiesAll(state).get(API.TAXONOMIES);
export const selectFrameworkTaxonomies = (state) => selectEntitiesAll(state).get(API.FRAMEWORK_TAXONOMIES);
export const selectRecommendationCategories = (state) => selectEntitiesAll(state).get(API.RECOMMENDATION_CATEGORIES);
export const selectRoles = (state) => selectEntitiesAll(state).get(API.ROLES);
export const selectPages = (state) => selectEntitiesAll(state).get(API.PAGES);
export const selectBookmarks = (state) => selectEntitiesAll(state).get(API.BOOKMARKS);
export const selectUserRoles = (state) => selectEntitiesAll(state).get(API.USER_ROLES);
export const selectFrameworks = (state) => selectEntitiesAll(state).get(API.FRAMEWORKS);
export const selectUsers = (state) => selectEntitiesAll(state).get(API.USERS);


export const selectIndicators = (state) => selectEntitiesAll(state).get('indicators');
export const selectMeasures = (state) => selectEntitiesAll(state).get('measures');
export const selectMeasureCategories = (state) => selectEntitiesAll(state).get('measure_categories');
export const selectMeasureIndicators = (state) => selectEntitiesAll(state).get('measure_indicators');
export const selectRecommendationMeasures = (state) => selectEntitiesAll(state).get('recommendation_measures');
export const selectRecommendationIndicators = (state) => selectEntitiesAll(state).get('recommendation_indicators');
export const selectUserCategories = (state) => selectEntitiesAll(state).get('user_categories');
export const selectProgressReports = (state) => selectEntitiesAll(state).get('progress_reports');
export const selectDueDates = (state) => selectEntitiesAll(state).get('due_dates');


export const selectNewEntityModal = createSelector(
  getGlobal,
  (globalState) => globalState.get('newEntityModal'),
);
export const selectShowSettings = createSelector(
  getGlobal,
  (globalState) => !!globalState.get('showSettings'),
);
export const selectSettingsConfig = createSelector(
  getGlobal,
  (globalState) => globalState.get('settings'),
);

export const selectIsAuthenticating = createSelector(
  getGlobal,
  (globalState) => globalState.getIn(['auth', 'sending']),
);

export const selectOtpTempToken = createSelector(
  getGlobal,
  (globalState) => globalState.getIn(['auth', 'otpTempToken']),
);
export const selectIsOtpAfterRegister = createSelector(
  getGlobal,
  (globalState) => globalState.getIn(['auth', 'isOtpAfterRegister']),
);

const selectReadyUserRoles = (state) => !!state.getIn(['global', 'ready', 'user_roles']);

export const selectReadyForAuthCheck = createSelector(
  selectIsAuthenticating,
  selectReadyUserRoles,
  (isAuthenticating, rolesReady) => !isAuthenticating && rolesReady,
);

export const selectSessionUser = createSelector(
  getGlobal,
  (state) => state.get('user'),
);

export const selectIsSignedIn = createSelector(
  selectSessionUser,
  (sessionUser) => sessionUser && sessionUser.get('isSignedIn'),
);

export const selectSessionUserAttributes = createSelector(
  selectSessionUser,
  (sessionUser) => sessionUser && sessionUser.get('attributes'),
);

export const selectSessionUserId = createSelector(
  selectSessionUserAttributes,
  (sessionUserAttributes) => sessionUserAttributes && sessionUserAttributes.id.toString(),
);

export const selectIsSigningIn = createSelector(
  selectIsSignedIn,
  selectSessionUserAttributes,
  (signedIn, user) => signedIn && !user,
);

// const makeSessionUserRoles = () => selectSessionUserRoles;
export const selectSessionUserRoles = createSelector(
  selectUserRoles,
  selectIsSignedIn,
  selectSessionUserId,
  (userRoles, isSignedIn, sessionUserId) => {
    if (isSignedIn && sessionUserId && userRoles) {
      return userRoles
        .filter((role) => qe(role.getIn(['attributes', 'user_id']), sessionUserId))
        .map((role) => role.getIn(['attributes', 'role_id']))
        .toList();
    }
    return Map();
  },
);


export const selectIsUserAdmin = createSelector(
  selectSessionUserRoles,
  (userRoles) => userRoles.includes(USER_ROLES.ADMIN.value),
);

export const selectIsUserManager = createSelector(
  selectSessionUserRoles,
  (userRoles) => userRoles.includes(USER_ROLES.MANAGER.value)
    || userRoles.includes(USER_ROLES.ADMIN.value),
);

export const selectIsUserContributor = createSelector(
  selectSessionUserRoles,
  (userRoles) => userRoles.includes(USER_ROLES.CONTRIBUTOR.value)
    || userRoles.includes(USER_ROLES.MANAGER.value)
    || userRoles.includes(USER_ROLES.ADMIN.value),
);


export const selectHasUserRole = createSelector(
  selectIsUserAdmin,
  selectIsUserManager,
  selectIsUserContributor,
  (isAdmin, isManager, isContributor) => ({
    [USER_ROLES.ADMIN.value]: isAdmin,
    [USER_ROLES.MANAGER.value]: isManager,
    [USER_ROLES.CONTRIBUTOR.value]: isContributor,
  }),
);

export const selectCanUserAdministerCategories = createSelector(
  selectHasUserRole,
  (hasUserRole) => hasUserRole[CATEGORY_ADMIN_MIN_ROLE],
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
  },
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
  },
);

export const selectRedirectOnAuthSuccessPath = createSelector(
  getRoute,
  (routeState) => {
    try {
      return routeState.getIn([
        'locationBeforeTransitions',
        'query',
        PARAMS.REDIRECT_ON_AUTH_SUCCESS,
      ]);
    } catch (error) {
      return null;
    }
  },
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
  },
);

export const selectPreviousPathname = createSelector(
  getRoute,
  (routeState) => {
    try {
      return routeState.getIn(['locationBeforeTransitions', 'pathnamePrevious']);
    } catch (error) {
      return null;
    }
  },
);

export const selectRequestedAt = createSelector(
  getGlobalRequested,
  (state, { path }) => path,
  (requested, path) => requested.get(path),
);

export const selectReady = (state, { path }) => reduce(asArray(path),
  (areReady, readyPath) => areReady && (
    !!state.getIn(['global', 'ready', readyPath])
      || DB_TABLES.indexOf(readyPath) === -1
  ),
  true);

export const selectLocation = createSelector(
  getRoute,
  (routeState) => {
    try {
      return routeState.get('locationBeforeTransitions');
    } catch (error) {
      return null;
    }
  },
);

export const selectLocationQuery = createSelector(
  selectLocation,
  (location) => location && location.get('query'),
);

// TODO consider replacing all "(state, locationQuery) => locationQuery" with selectLocationQuery
const selectWhereQuery = (state, locationQuery) => locationQuery && locationQuery.get('where');

export const selectAttributeQuery = createSelector(
  (state, { locationQuery }) => selectWhereQuery(state, locationQuery),
  (whereQuery) => whereQuery && asList(whereQuery).reduce(
    (memo, where) => {
      const attrValue = where.split(':');
      return Object.assign(memo, { [attrValue[0]]: attrValue[1] });
    },
    {},
  ),
);

export const selectWithoutQuery = (state, locationQuery) => locationQuery && locationQuery.get('without');

export const selectCategoryQuery = (state, locationQuery) => locationQuery && locationQuery.get('cat');

export const selectConnectionQuery = (state, locationQuery) => locationQuery && locationQuery.get('connected');

export const selectConnectedCategoryQuery = (state, locationQuery) => locationQuery && locationQuery.get('catx');

export const selectSearchQuery = (state, locationQuery) => locationQuery && locationQuery.get('search');

export const selectFrameworkListQuery = (state, locationQuery) => locationQuery && locationQuery.get('fwx');

export const selectExpandQuery = createSelector(
  (state, locationQuery) => locationQuery,
  (locationQuery) => locationQuery && locationQuery.get('expand')
    ? parseInt(locationQuery.get('expand'), 10)
    : 0,
);

export const selectSortOrderQuery = (state, locationQuery) => locationQuery && locationQuery.get('order');

export const selectSortByQuery = (state, locationQuery) => locationQuery && locationQuery.get('sort');

export const selectFrameworkQuery = createSelector(
  selectLocationQuery,
  (query) => (query && query.get('fw'))
    ? query.get('fw')
    : 'all',
);

export const selectLoadArchivedQuery = createSelector(
  selectLocationQuery,
  (query) => ((query && query.get('loadArchived') === 'true') || false),
);
export const selectLoadNonCurrentQuery = createSelector(
  selectLocationQuery,
  (query) => ((query && query.get('loadNonCurrent') === 'true') || false),
);

export const selectSettingsFromQuery = createSelector(
  selectLoadArchivedQuery,
  selectLoadNonCurrentQuery,
  (loadArchived, loadNonCurrent) => ({
    loadArchived,
    loadNonCurrent,
  }),
);

const selectEntitiesAll = (state) => state.getIn(['global', 'entities']);

const selectEntities = (state, path) => {
  const entities = selectEntitiesAll(state);
  return entities.get(path);
};

export const selectPublishedPages = createSelector(
  selectPages,
  (pages) => pages
    ? filterEntitiesByAttributes(pages, { draft: false })
    : pages,
);

// use for testing single framework configuration
// && entities.filter((fw) => fw.get('id') === '1')

export const selectCurrentFrameworkId = createSelector(
  selectFrameworkQuery,
  selectFrameworks,
  (queryId, frameworks) => {
    if (frameworks && frameworks.size === 1) {
      return frameworks.first().get('id');
    }
    return queryId;
  },
);
export const selectCurrentFramework = createSelector(
  selectFrameworkQuery,
  selectFrameworks,
  (queryId, frameworks) => {
    if (frameworks && frameworks.size === 1) {
      return frameworks.first();
    }
    return null;
  },
);

export const selectActiveFrameworks = createSelector(
  selectFrameworkQuery,
  selectFrameworks,
  (queryId, frameworks) => {
    if (
      frameworks
      && frameworks.size > 1
      && queryId
      && queryId !== 'all'
    ) {
      return frameworks.filter((fw) => qe(queryId, fw.get('id')));
    }
    return frameworks;
  },
);

export const selectRecommendationCategoriesByRecommendation = createSelector(
  selectRecommendationCategories,
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'recommendation_id']),
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'category_id']),
      ),
    ),
);
export const selectRecommendationCategoriesByCategory = createSelector(
  selectRecommendationCategories,
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'category_id']),
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'recommendation_id']),
      ),
    ),
);
export const selectRecommendationMeasuresByRecommendation = createSelector(
  selectRecommendationMeasures,
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'recommendation_id']),
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'measure_id']),
      ),
    ),
);
export const selectRecommendationMeasuresByMeasure = createSelector(
  selectRecommendationMeasures,
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'measure_id']),
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'recommendation_id']),
      ),
    ),
);
export const selectRecommendationIndicatorsByRecommendation = createSelector(
  selectRecommendationIndicators,
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'recommendation_id']),
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'indicator_id']),
      ),
    ),
);
export const selectRecommendationIndicatorsByIndicator = createSelector(
  selectRecommendationIndicators,
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'indicator_id']),
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'recommendation_id']),
      ),
    ),
);
export const selectMeasureIndicatorsByMeasure = createSelector(
  selectMeasureIndicators,
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'measure_id']),
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'indicator_id']),
      ),
    ),
);
export const selectMeasureIndicatorsByIndicator = createSelector(
  selectMeasureIndicators,
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'indicator_id']),
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'measure_id']),
      ),
    ),
);
export const selectMeasureCategoriesByMeasure = createSelector(
  selectMeasureCategories,
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'measure_id']),
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'category_id']),
      ),
    ),
);
export const selectMeasureCategoriesByCategory = createSelector(
  selectMeasureCategories,
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'category_id']),
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'measure_id']),
      ),
    ),
);
export const selectUserCategoriesByUser = createSelector(
  selectUserCategories,
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'user_id']),
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'category_id']),
      ),
    ),
);
export const selectUserCategoriesByCategory = createSelector(
  selectUserCategories,
  (entities) => entities
    && entities.groupBy(
      (entity) => entity.getIn(['attributes', 'category_id']),
    ).map(
      (group) => group.map(
        (entity) => entity.getIn(['attributes', 'user_id']),
      ),
    ),
);

export const selectRecommendationReferences = createSelector(
  selectRecommendationsRaw,
  (entities) => entities && entities.map((e) => e.getIn(['attributes', 'reference'])).toList().toArray(),
);
export const selectMeasureReferences = createSelector(
  selectMeasures,
  (entities) => entities && entities.map((e) => e.getIn(['attributes', 'reference'])).toList().toArray(),
);
export const selectIndicatorReferences = createSelector(
  selectIndicators,
  (entities) => entities && entities.map((e) => e.getIn(['attributes', 'reference'])).toList().toArray(),
);

export const selectFWRecommendations = createSelector(
  selectRecommendationsRaw,
  selectCurrentFrameworkId,
  selectCurrentFramework,
  (entities, frameworkId, framework) => {
    if (entities && frameworkId && frameworkId !== 'all' && framework) {
      const result = entities.filter(
        (rec) => qe(
          frameworkId,
          rec.getIn(['attributes', 'framework_id']),
        ),
      );
      if (framework.getIn(['attributes', 'has_response'])) {
        return result.map(
          (rec) => {
            if (
              rec.getIn(['attributes', 'support_level']) === null
              || typeof rec.getIn(['attributes', 'support_level']) === 'undefined'
            ) {
              return rec.setIn(['attributes', 'support_level'], null);
            }
            return rec;
          },
        );
      }
      return result;
    }
    return entities;
  },
);
// returns measures not associated or associated with current framework
export const selectFWMeasures = createSelector(
  selectMeasures,
  selectFrameworkQuery,
  selectFWRecommendations,
  selectRecommendationMeasuresByMeasure,
  selectIsUserManager,
  (entities, framework, recs, recMeasuresGrouped, isManager) => {
    if (entities && recs && recMeasuresGrouped) {
      if (framework && framework !== 'all') {
        return entities.filter(
          (measure) => {
            const recIds = recMeasuresGrouped.get(parseInt(measure.get('id'), 10));
            if (!recIds || recIds.size === 0) return isManager;
            return recIds.some(
              (id) => !!recs.get(id.toString()),
            );
          },
        );
      }
      return entities;
    }
    return null;
  },
);

// get indicators for current framework
export const selectFWIndicators = createSelector(
  selectIndicators,
  selectCurrentFrameworkId,
  selectFWRecommendations,
  selectFWMeasures,
  selectRecommendationIndicatorsByIndicator,
  selectMeasureIndicatorsByIndicator,
  (entities, frameworkId, recs, measures, recIndicatorsGrouped, measureIndicatorsGrouped) => {
    if (
      recs
      && measures
      && recIndicatorsGrouped
      && measureIndicatorsGrouped
      && frameworkId
      && frameworkId !== 'all'
    ) {
      return entities.filter(
        (indicator) => {
          const recIds = recIndicatorsGrouped.get(parseInt(indicator.get('id'), 10));
          const measureIds = measureIndicatorsGrouped.get(parseInt(indicator.get('id'), 10));
          return (
            (!recIds || recIds.size === 0)
            && (!measureIds || measureIds.size === 0)
          ) || (
            recIds && recIds.some((id) => !!recs.get(id.toString()))
          ) || (
            measureIds && measureIds.some((id) => !!measures.get(id.toString()))
          );
        },
      );
    }
    return entities;
  },
);

export const selectFWEntitiesAll = createSelector(
  selectEntitiesAll,
  selectFWRecommendations,
  selectFWMeasures,
  selectFWIndicators,
  (entities, recs, measures, indicators) => entities
    .set('recommendations', recs)
    .set('measures', measures)
    .set('indicators', indicators),
);

export const selectTaxonomies = createSelector(
  selectTaxonomiesRaw,
  selectFrameworkTaxonomies,
  (taxonomies, fwTaxonomies) => taxonomies
    && fwTaxonomies
    && taxonomies.map(
      (tax) => {
        const hasFramework = !!tax.getIn(['attributes', 'framework_id']);
        // connected to current framework
        const connectedToFramework = fwTaxonomies.some(
          (fwt) => qe(
            fwt.getIn(['attributes', 'taxonomy_id']),
            tax.get('id'),
          ),
        );
        // connectedFrameworks
        const frameworkIds = fwTaxonomies.reduce(
          (memo, fwt) => {
            if (
              qe(
                fwt.getIn(['attributes', 'taxonomy_id']),
                tax.get('id'),
              )
            ) {
              return memo.push(fwt.getIn(['attributes', 'framework_id']));
            }
            return memo;
          },
          List(),
        );
        return tax.setIn(
          ['attributes', 'tags_recommendations'],
          hasFramework || connectedToFramework,
        ).set(
          'frameworkIds',
          frameworkIds,
        );
      },
    ).filter(
      (tax) => tax.getIn(['attributes', 'tags_recommendations'])
        || tax.getIn(['attributes', 'tags_measures'])
        || tax.getIn(['attributes', 'tags_users']),
    ),
);

export const selectFWTaxonomies = createSelector(
  selectTaxonomiesRaw,
  selectFrameworkTaxonomies,
  selectCategories,
  selectCurrentFrameworkId,
  (taxonomies, fwTaxonomies, categories, frameworkId) => taxonomies
    && fwTaxonomies
    && taxonomies.map(
      (tax) => {
        const fwNotSet = !frameworkId || frameworkId === 'all';
        const hasFramework = !!tax.getIn(['attributes', 'framework_id'])
          && (
            fwNotSet
            || qe(tax.getIn(['attributes', 'framework_id']), frameworkId)
          );
        // connected to current framework
        const connectedToFramework = fwTaxonomies.some(
          (fwt) => qe(
            fwt.getIn(['attributes', 'taxonomy_id']),
            tax.get('id'),
          ) && (
            fwNotSet
            || qe(
              fwt.getIn(['attributes', 'framework_id']),
              frameworkId,
            )
          ),
        );
        // connectedFrameworks
        const frameworkIds = fwTaxonomies.reduce(
          (memo, fwt) => {
            if (
              qe(
                fwt.getIn(['attributes', 'taxonomy_id']),
                tax.get('id'),
              )
            ) {
              return memo.push(fwt.getIn(['attributes', 'framework_id']));
            }
            return memo;
          },
          List(),
        );
        const taxCategories = getTaxCategories(categories, tax);
        return tax
          .setIn(['attributes', 'tags_recommendations'], hasFramework || connectedToFramework)
          .set('frameworkIds', frameworkIds)
          .set('categories', taxCategories);
      },
    ).filter(
      (tax) => tax.getIn(['attributes', 'tags_recommendations'])
        || tax.getIn(['attributes', 'tags_measures'])
        || tax.getIn(['attributes', 'tags_users']),
    ),
);
export const selectTaxonomiesSorted = createSelector(
  selectTaxonomies,
  (taxonomies) => taxonomies
    && sortEntities(taxonomies, 'asc', 'priority', null, false),
);
export const selectFWTaxonomiesSorted = createSelector(
  selectFWTaxonomies,
  (taxonomies) => taxonomies
    && sortEntities(taxonomies, 'asc', 'priority', null, false),
);

export const selectEntity = createSelector(
  (state, { path }) => selectEntities(state, path),
  (state, { id }) => id,
  (entities, id) => id && entities.get(id.toString()),
);
export const selectTaxonomy = createSelector(
  (state, id) => id,
  selectTaxonomies,
  (id, entities) => id && entities.get(id.toString()),
);

// filter entities by attributes, using object
export const selectEntitiesWhere = createSelector(
  (state, { where }) => where,
  (state, { path }) => selectEntities(state, path),
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities,
);

// filter entities by attributes, using locationQuery
const selectEntitiesWhereQuery = createSelector(
  selectAttributeQuery,
  (state, { path }) => selectEntities(state, path),
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities,
);
export const selectEntitiesSearchQuery = createSelector(
  selectEntitiesWhereQuery,
  (state, { locationQuery }) => selectSearchQuery(state, locationQuery),
  (state, { searchAttributes }) => searchAttributes,
  (entities, query, searchAttributes) => query
    ? filterEntitiesByKeywords(entities, query, searchAttributes)
    : entities, // !search
);

// filter entities by attributes, using object
export const selectRecommendationsWhere = createSelector(
  (state, { where }) => where,
  selectFWRecommendations,
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities,
);

// filter entities by attributes, using locationQuery
const selectRecommendationsWhereQuery = createSelector(
  selectAttributeQuery,
  selectFWRecommendations,
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities,
);

export const selectRecommendationsSearchQuery = createSelector(
  selectRecommendationsWhereQuery,
  (state, { locationQuery }) => selectSearchQuery(state, locationQuery),
  (state, { searchAttributes }) => searchAttributes,
  (entities, query, searchAttributes) => query
    ? filterEntitiesByKeywords(entities, query, searchAttributes)
    : entities, // !search
);

// filter entities by attributes, using object
export const selectMeasuresWhere = createSelector(
  (state, { where }) => where,
  selectFWMeasures,
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities,
);

// filter entities by attributes, using locationQuery
const selectMeasuresWhereQuery = createSelector(
  selectAttributeQuery,
  selectFWMeasures,
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities,
);
export const selectMeasuresSearchQuery = createSelector(
  selectMeasuresWhereQuery,
  (state, { locationQuery }) => selectSearchQuery(state, locationQuery),
  (state, { searchAttributes }) => searchAttributes,
  (entities, query, searchAttributes) => query
    ? filterEntitiesByKeywords(entities, query, searchAttributes)
    : entities, // !search
);

// filter entities by attributes, using object
export const selectIndicatorsWhere = createSelector(
  (state, { where }) => where,
  selectFWIndicators,
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities,
);

// filter entities by attributes, using locationQuery
const selectIndicatorsWhereQuery = createSelector(
  selectAttributeQuery,
  selectFWIndicators,
  (query, entities) => query
    ? filterEntitiesByAttributes(entities, query)
    : entities,
);
export const selectIndicatorsSearchQuery = createSelector(
  selectIndicatorsWhereQuery,
  (state, { locationQuery }) => selectSearchQuery(state, locationQuery),
  (state, { searchAttributes }) => searchAttributes,
  (entities, query, searchAttributes) => query
    ? filterEntitiesByKeywords(entities, query, searchAttributes)
    : entities, // !search
);

export const selectUserConnections = createSelector(
  selectRoles,
  (roles) => Map().set('roles', roles),
);

export const selectRecommendationConnections = createSelector(
  selectFWMeasures,
  selectFWIndicators,
  (measures, indicators) => Map()
    .set('measures', measures)
    .set('indicators', indicators),
);

export const selectIndicatorConnections = createSelector(
  selectFWMeasures,
  selectFWRecommendations,
  (measures, recommendations) => Map()
    .set('measures', measures)
    .set('recommendations', recommendations),
);

export const selectMeasureConnections = createSelector(
  selectFWRecommendations,
  selectFWIndicators,
  (recommendations, indicators) => Map()
    .set('recommendations', recommendations)
    .set('indicators', indicators),
);

export const selectMeasureTaxonomies = createSelector(
  (state, args) => args ? args.includeParents : true,
  selectFWTaxonomiesSorted,
  selectCategories,
  (includeParents, taxonomies, categories) => prepareTaxonomies(
    taxonomies,
    categories,
    'tags_measures',
    includeParents,
  ),
);

export const selectRecommendationTaxonomies = createSelector(
  (state, args) => args ? args.includeParents : true,
  selectFWTaxonomiesSorted,
  selectCategories,
  (includeParents, taxonomies, categories) => prepareTaxonomies(
    taxonomies,
    categories,
    'tags_recommendations',
    includeParents,
  ),
);
export const selectAllTaxonomiesWithCategories = createSelector(
  selectTaxonomiesRaw,
  selectCategories,
  (taxonomies, categories) => sortEntities(
    taxonomies,
    'asc',
    'priority',
    null,
    false, // as Map
  ).map(
    (tax) => tax.set(
      'categories',
      categories.filter(
        (cat) => qe(
          tax.get('id'),
          cat.getIn(['attributes', 'taxonomy_id']),
        ),
      ),
    ),
  ),
);

export const selectUserTaxonomies = createSelector(
  selectFWTaxonomiesSorted,
  selectCategories,
  (taxonomies, categories) => prepareTaxonomies(
    taxonomies,
    categories,
    'tags_users',
  ),
);

// get recommendations with category ids
export const selectRecommendationsCategorised = createSelector(
  selectFWRecommendations,
  selectRecommendationCategoriesByRecommendation,
  (entities, associationsGrouped) => entitiesSetCategoryIds(
    entities,
    associationsGrouped,
  ),
);

export const selectMeasuresCategorised = createSelector(
  selectFWMeasures,
  selectMeasureCategoriesByMeasure,
  (entities, associationsGrouped) => entitiesSetCategoryIds(
    entities,
    associationsGrouped,
  ),
);

export const selectViewRecommendationFrameworkId = createSelector(
  (state, id) => selectEntity(state, { path: 'recommendations', id }),
  selectCurrentPathname,
  (entity, pathname) => {
    if (
      pathname.startsWith(ROUTES.RECOMMENDATIONS)
      && entity
      && entity.getIn(['attributes', 'framework_id'])
    ) {
      return entity.getIn(['attributes', 'framework_id']).toString();
    }
    return null;
  },

);

// export const selectCategoriesByParent = createSelector(
//   selectCategories,
//   (categories) => categories && categories.map(
//     (cat) => categories.filter(
//       (child) => qe(
//         cat.get('id'),
//         child.getIn(['attributes', 'parent_id']),
//       )
//     ).keySeq()
//   ),
// );


// if there are any non-current categories from the relevant taxonomies then we have multiple cycles
export const selectHasPreviousCycles = createSelector(
  selectCategories,
  (categories) => categories.some(
    (cat) => !cat.getIn(['attributes', 'is_current'])
      && CURRENT_TAXONOMY_IDS.indexOf(parseInt(cat.getIn(['attributes', 'taxonomy_id']), 10)) > -1,
  ),
);
