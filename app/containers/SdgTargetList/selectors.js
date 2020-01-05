import { createSelector } from 'reselect';
import { List, Map } from 'immutable';
import { reduce } from 'lodash/collection';

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
  testEntityEntityAssociation,
  entitiesSetSingle,
  getEntityCategories,
  entitiesSetCategoryIds,
  filterTaxonomies,
  getEntityConnections,
  getTaxonomyCategories,
} from 'utils/entities';

import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG } from './constants';

export const selectConnections = createSelector(
  (state) => selectEntities(state, 'indicators'),
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'categories'),
  (indicators, measures, measureCategories, categories) =>
    Map()
    .set('indicators', indicators)
    .set('measures',
      entitiesSetCategoryIds(measures, 'measure_id', measureCategories, categories)
    )
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectConnections(state),
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'measure_categories'),
  (connections, taxonomies, categories, categoryMeasures) =>
    // for all connections
    reduce([
      {
        tags: 'tags_measures',
        path: 'measures',
        key: 'measure_id',
        associations: categoryMeasures,
      },
    ], (connectedTaxonomies, relationship) =>
      // merge connected taxonomies.
      // TODO deal with conflicts
      connectedTaxonomies.merge(
        filterTaxonomies(taxonomies, relationship.tags, true)
        .map((taxonomy) => taxonomy.set('categories', getTaxonomyCategories(
          taxonomy,
          categories,
          relationship,
          connections.get(relationship.path),
        )))
      )
    , Map())
);

const selectSdgTargetsNested = createSelector(
  (state, locationQuery) => selectEntitiesSearchQuery(state, {
    path: 'sdgtargets',
    searchAttributes: CONFIG.search || ['title', 'reference'],
    locationQuery,
  }),
  (state) => selectConnections(state),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (state) => selectEntities(state, 'categories'),
  (
    entities,
    connections,
    entityCategories,
    entityIndicators,
    entityMeasures,
    categories,
  ) => entities.map((entity) => entity
    .set('categories', getEntityCategories(entity.get('id'), entityCategories, 'sdgtarget_id', categories))
    .set('measures', getEntityConnections(
      entity.get('id'),
      entityMeasures,
      'measure_id',
      'sdgtarget_id',
      connections.get('measures'),
    ))
    // nest connected indicator ids
    .set('indicators', getEntityConnections(
      entity.get('id'),
      entityIndicators,
      'indicator_id',
      'sdgtarget_id',
      connections.get('indicators'),
    ))
  )
);
const selectSdgTargetsWithout = createSelector(
  selectSdgTargetsNested,
  (state) => selectEntities(state, 'categories'),
  selectWithoutQuery,
  (entities, categories, query) => query
    ? filterEntitiesWithoutAssociation(entities, categories, query)
    : entities
);
const selectSdgTargetsByConnections = createSelector(
  selectSdgTargetsWithout,
  selectConnectionQuery,
  (entities, query) => query
    ? filterEntitiesByConnection(entities, query)
    : entities
);
const selectSdgTargetsByCategories = createSelector(
  selectSdgTargetsByConnections,
  selectCategoryQuery,
  (entities, query) => query
    ? filterEntitiesByCategories(entities, query)
    : entities
);
const selectSdgTargetsByConnectedCategories = createSelector(
  selectSdgTargetsByCategories,
  selectConnections,
  selectConnectedCategoryQuery,
  (entities, connections, query) => query
    ? filterEntitiesByConnectedCategories(entities, connections, query)
    : entities
);

const selectSdgTargetsExpandables = createSelector(
  selectSdgTargetsByConnectedCategories,
  (state) => selectEntities(state, 'indicators'),
  (state) => selectEntities(state, 'progress_reports'),
  (state) => selectEntities(state, 'due_dates'),
  selectExpandQuery,
  (entities, indicators, reports, dueDates, expandNo) =>
    entities.map((entity) => {
      if (expandNo <= 0) {
        // insert expandables:
        // - indicators
        // - reports (incl due_dates)
        const dueDatesAnyIndicator = dueDates.filter((date) => testEntityEntityAssociation(entity, 'indicators', date.getIn(['attributes', 'indicator_id'])));
        return entity
        .set('expandable', List(['indicators', 'reports']))
        .set('reports', reports.filter((report) => testEntityEntityAssociation(entity, 'indicators', report.getIn(['attributes', 'indicator_id']))))
        .set('dates', Map()
          .set('overdue', dueDatesAnyIndicator.filter((date) => date.getIn(['attributes', 'overdue'])).size)
          .set('due', dueDatesAnyIndicator.filter((date) => date.getIn(['attributes', 'due'])).size)
        );
      }
      // insert expanded indicators with expandable reports (incl due_dates)
      return entity
      .set('expanded', 'indicatorsExpanded')
      .set('indicatorsExpanded',
        indicators
        .filter((indicator) => testEntityEntityAssociation(entity, 'indicators', indicator.get('id')))
        .map((indicator) => {
          // due dates for indicator
          const dueDatesForIndicator = dueDates.filter((date) => attributesEqual(date.getIn(['attributes', 'indicator_id']), indicator.get('id')));
          const reportsForIndicator = reports.filter((report) => attributesEqual(report.getIn(['attributes', 'indicator_id']), indicator.get('id')));
          if (expandNo === 1) {
            return indicator
            .set('expandable', 'reports')
            .set('reports', reportsForIndicator)
            .set('dates', Map()
              // store counts
              .set('overdue', dueDatesForIndicator.filter((date) => date.getIn(['attributes', 'overdue'])).size)
              .set('due', dueDatesForIndicator.filter((date) => date.getIn(['attributes', 'due'])).size)
            );
          }
          const dueDatesScheduled = dueDatesForIndicator && dueDatesForIndicator.filter((date) => !date.getIn(['attributes', 'has_progress_report']));
          return indicator
          .set('expanded', 'reports')
          .set('reports', entitiesSetSingle(reportsForIndicator, dueDates, 'date', 'due_date_id'))
          .set('dates', Map()
            // store upcoming scheduled indicator
            .set('scheduled', dueDatesScheduled && sortEntities(dueDatesScheduled, 'asc', 'due_date', 'date').first())
          );
        })
      );
    })
);

// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearchQuery filters by keyword
// 3. selectSdgTargetsNested will nest related entities
// 4. selectSdgTargetsWithout will filter by absence of taxonomy or connection
// 5. selectSdgTargetsByConnections will filter by specific connection
// 6. selectSdgTargetsByCategories will filter by specific categories
export const selectSdgTargets = createSelector(
  selectSdgTargetsExpandables,
  selectSortByQuery,
  selectSortOrderQuery,
  (entities, sort, order) => {
    const sortOption = getSortOption(CONFIG.sorting, sort);
    return sortEntities(
      entities,
      order || (sortOption ? sortOption.order : 'asc'),
      sort || (sortOption ? sortOption.attribute : 'reference'),
      sortOption ? sortOption.type : 'string'
    );
  }
);
