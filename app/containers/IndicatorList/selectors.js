import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { reduce } from 'lodash/collection';

import { ENABLE_SDGS } from 'themes/config';

import {
  selectEntities,
  selectEntitiesSearchQuery,
  selectWithoutQuery,
  selectConnectionQuery,
  selectCategoryQuery,
  selectConnectedCategoryQuery,
  selectSortByQuery,
  selectSortOrderQuery,
  selectExpandQuery,
  selectTaxonomiesSorted,
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesByConnectedCategories,
  filterEntitiesWithoutAssociation,
  attributesEqual,
  entitiesSetSingle,
  entitiesSetCategoryIds,
  filterTaxonomies,
  getEntityConnections,
  getTaxonomyCategories,
} from 'utils/entities';

import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG } from './constants';

export const selectConnections = createSelector(
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'sdgtargets'),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (state) => selectEntities(state, 'categories'),
  (measures, sdgtargets, measureCategories, sdgtargetCategories, categories) =>
    Map()
    .set('measures',
      entitiesSetCategoryIds(measures, 'measure_id', measureCategories, categories)
    )
    .set('sdgtargets',
      ENABLE_SDGS && entitiesSetCategoryIds(sdgtargets, 'sdgtarget_id', sdgtargetCategories, categories)
    )
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectConnections(state),
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (connections, taxonomies, categories, categoryMeasures, categorySdgTargets) =>
    // for all connections
    reduce([
      {
        tags: 'tags_measures',
        path: 'measures',
        key: 'measure_id',
        associations: categoryMeasures,
      },
      ENABLE_SDGS && {
        tags: 'tags_sdgtargets',
        path: 'sdgtargets',
        key: 'sdgtarget_id',
        associations: categorySdgTargets,
      },
    ], (connectedTaxonomies, relationship) =>
      // TODO deal with conflicts
      // merge connected taxonomies.
      relationship
      ? connectedTaxonomies.merge(
        filterTaxonomies(taxonomies, relationship.tags, true)
        .map((taxonomy) => taxonomy.set('categories', getTaxonomyCategories(
          taxonomy,
          categories,
          relationship,
          connections.get(relationship.path),
        )))
      )
      : connectedTaxonomies
    , Map())
);

const selectIndicatorsNested = createSelector(
  (state, locationQuery) => selectEntitiesSearchQuery(state, {
    path: 'indicators',
    searchAttributes: CONFIG.search || ['title', 'reference'],
    locationQuery,
  }),
  (state) => selectConnections(state),
  (state) => selectEntities(state, 'measure_indicators'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (state) => selectEntities(state, 'progress_reports'),
  (state) => selectEntities(state, 'due_dates'),
  (state) => selectEntities(state, 'users'),
  (
    entities,
    connections,
    entityMeasures,
    entitySdgTargets,
    progressReports,
    dueDates,
    users
  ) =>
    entities.map((entity) => entity
    .set('measures', getEntityConnections(
      entity.get('id'),
      entityMeasures,
      'measure_id',
      'indicator_id',
      connections.get('measures'),
    ))
    // nest connected sdgtarget ids
    .set('sdgtargets', ENABLE_SDGS && getEntityConnections(
      entity.get('id'),
      entitySdgTargets,
      'sdgtarget_id',
      'measure_id',
      connections.get('sdgtargets'),
    ))
    // nest reports
    .set('reports', progressReports.filter((report) =>
      attributesEqual(report.getIn(['attributes', 'indicator_id']), entity.get('id'))
    ))
    // nest dates without report
    .set('dates', dueDates.filter((date) => {
      // is associated
      const associated = attributesEqual(date.getIn(['attributes', 'indicator_id']), entity.get('id'));
      if (associated) {
        // has no report
        const dateReports = progressReports.filter((report) => attributesEqual(report.getIn(['attributes', 'due_date_id']), date.get('id')));
        return !dateReports || dateReports.size === 0;
      }
      return false;
    }))
    .set(
      'manager',
      users.find((user) => entity.getIn(['attributes', 'manager_id']) && attributesEqual(user.get('id'), entity.getIn(['attributes', 'manager_id'])))
    )
  )
);
const selectIndicatorsWithout = createSelector(
  selectIndicatorsNested,
  (state) => selectEntities(state, 'categories'),
  selectWithoutQuery,
  (entities, categories, query) => query
    ? filterEntitiesWithoutAssociation(entities, categories, query)
    : entities
);
const selectIndicatorsByConnections = createSelector(
  selectIndicatorsWithout,
  selectConnectionQuery,
  (entities, query) => query
    ? filterEntitiesByConnection(entities, query)
    : entities
);
const selectIndicatorsByCategories = createSelector(
  selectIndicatorsByConnections,
  selectCategoryQuery,
  (entities, query) => query
    ? filterEntitiesByCategories(entities, query)
    : entities
);
const selectIndicatorsByConnectedCategories = createSelector(
  selectIndicatorsByCategories,
  selectConnections,
  selectConnectedCategoryQuery,
  (entities, connections, query) => query
    ? filterEntitiesByConnectedCategories(entities, connections, query)
    : entities
);
const selectIndicatorsExpandables = createSelector(
  selectIndicatorsByConnectedCategories,
  (state) => selectEntities(state, 'progress_reports'),
  (state) => selectEntities(state, 'due_dates'),
  selectExpandQuery,
  (entities, reports, dueDates, expandNo) =>
    entities.map((entity) => {
      const dueDatesForIndicator = dueDates.filter((date) => attributesEqual(entity.get('id'), date.getIn(['attributes', 'indicator_id'])));
      const reportsForIndicator = reports.filter((report) => attributesEqual(entity.get('id'), report.getIn(['attributes', 'indicator_id'])));
      if (expandNo <= 0) {
        // insert expandables:
        // - indicators
        // - reports (incl due_dates)
        return entity
        .set('expandable', 'reports')
        .set('reports', reportsForIndicator)
        .set('dates', Map()
          .set('overdue', dueDatesForIndicator.filter((date) => date.getIn(['attributes', 'overdue'])).size)
          .set('due', dueDatesForIndicator.filter((date) => date.getIn(['attributes', 'due'])).size)
        );
      }
      // insert expanded indicators with expandable reports (incl due_dates)
      const dueDatesScheduled = dueDatesForIndicator.filter((date) => !date.getIn(['attributes', 'has_progress_report']));
      return entity
      .set('expanded', 'reports')
      .set('reports', entitiesSetSingle(reportsForIndicator, dueDates, 'date', 'due_date_id'))
      .set('dates', Map()
        // store upcoming scheduled indicator
        .set('scheduled', dueDatesScheduled && sortEntities(dueDatesScheduled, 'asc', 'due_date', 'date').first())
      );
    })
);
// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearchQuery filters by keyword
// 3. selectIndicatorsNested will nest related entities
// 4. selectIndicatorsWithout will filter by absence of taxonomy or connection
// 5. selectIndicatorsByConnections will filter by specific connection
// 6. selectIndicatorsByCategories will filter by specific categories
// 7. selectIndicatorsByCOnnectedCategories will filter by specific categories connected via connection
export const selectIndicators = createSelector(
  selectIndicatorsExpandables,
  selectSortByQuery,
  selectSortOrderQuery,
  (entities, sort, order) => {
    const sortOption = getSortOption(CONFIG.sorting, sort);
    return sortEntities(
      entities,
      order || (sortOption ? sortOption.order : 'desc'),
      sort || (sortOption ? sortOption.attribute : 'id'),
      sortOption ? sortOption.type : 'string'
    );
  }
);
