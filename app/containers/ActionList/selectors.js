import { createSelector } from 'reselect';
import { Map, List } from 'immutable';
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
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesByConnectedCategories,
  filterEntitiesWithoutAssociation,
  attributesEqual,
  testEntityEntityAssociation,
  entitiesSetCategoryIds,
  entitiesSetSingle,
} from 'utils/entities';

import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG } from './constants';

export const selectConnections = createSelector(
  (state) => selectEntities(state, 'indicators'),
  (state) => selectEntities(state, 'recommendations'),
  (state) => selectEntities(state, 'sdgtargets'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (indicators, recommendations, sdgtargets, recommendationCategories, sdgtargetCategories) =>
    Map()
    .set('indicators', indicators)
    .set('recommendations',
      entitiesSetCategoryIds(recommendations, 'recommendation_id', recommendationCategories)
    )
    .set('sdgtargets',
      entitiesSetCategoryIds(sdgtargets, 'sdgtarget_id', sdgtargetCategories)
    )
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectConnections(state),
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (connections, taxonomies, categories, categoryRecommendations, categorySdgTargets) =>
    // for all connections
    reduce([
      {
        tags: 'tags_recommendations',
        path: 'recommendations',
        key: 'recommendation_id',
        associations: categoryRecommendations,
      },
      {
        tags: 'tags_sdgtargets',
        path: 'sdgtargets',
        key: 'sdgtarget_id',
        associations: categorySdgTargets,
      },
    ], (connectedTaxonomies, connection) =>
      // TODO deal with conflicts
      // merge connected taxonomies.
      connectedTaxonomies.merge(
        taxonomies
        .filter((taxonomy) => taxonomy.getIn(['attributes', connection.tags]))
        .map((taxonomy) => taxonomy.set(
          'categories',
          categories
          .filter((category) => attributesEqual(category.getIn(['attributes', 'taxonomy_id']), taxonomy.get('id')))
          .map((category) => category.set(
            connection.path,
            connection.associations
            .filter((association) =>
              attributesEqual(association.getIn(['attributes', 'category_id']), category.get('id'))
              && connections.getIn([connection.path, association.getIn(['attributes', connection.key]).toString()])
            )
            .map((association) => association.getIn(['attributes', connection.key]))
          ))
        ))
      )
    , Map())
);

const selectMeasuresNested = createSelector(
  (state, locationQuery) => selectEntitiesSearchQuery(state, {
    path: 'measures',
    searchAttributes: ['title'],
    locationQuery,
  }),
  (state) => selectConnections(state),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'measure_indicators'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (
    entities,
    connections,
    measureCategories,
    measureIndicators,
    measureRecommendations,
    measureSdgTargets,
  ) => entities.map((entity) => entity
    // nest category ids
    .set(
      'categories',
      measureCategories
      .filter((association) => attributesEqual(association.getIn(['attributes', 'measure_id']), entity.get('id')))
      .map((association) => association.getIn(['attributes', 'category_id']))
    )
    // nest connected recommendation ids
    .set(
      'recommendations',
      measureRecommendations
      .filter((association) =>
        attributesEqual(association.getIn(['attributes', 'measure_id']), entity.get('id'))
        && connections.getIn(['recommendations', association.getIn(['attributes', 'recommendation_id']).toString()])
      )
      .map((association) => association.getIn(['attributes', 'recommendation_id']))
    )
    // nest connected sdgtarget ids
    .set(
      'sdgtargets',
      measureSdgTargets
      .filter((association) =>
        attributesEqual(association.getIn(['attributes', 'measure_id']), entity.get('id'))
        && connections.getIn(['sdgtargets', association.getIn(['attributes', 'sdgtarget_id']).toString()])
      )
      .map((association) => association.getIn(['attributes', 'sdgtarget_id']))
    )
    // nest connected indicator ids
    .set(
      'indicators',
      measureIndicators
      .filter((association) =>
        attributesEqual(association.getIn(['attributes', 'measure_id']), entity.get('id'))
        && connections.getIn(['indicators', association.getIn(['attributes', 'indicator_id']).toString()])
      )
      .map((association) => association.getIn(['attributes', 'indicator_id']))
    )
  )
);
const selectMeasuresWithout = createSelector(
  selectMeasuresNested,
  (state) => selectEntities(state, 'categories'),
  selectWithoutQuery,
  (entities, categories, query) => query
    ? filterEntitiesWithoutAssociation(entities, categories, query)
    : entities
);
const selectMeasuresByConnections = createSelector(
  selectMeasuresWithout,
  selectConnectionQuery,
  (entities, query) => query
    ? filterEntitiesByConnection(entities, query)
    : entities
);
const selectMeasuresByCategories = createSelector(
  selectMeasuresByConnections,
  selectCategoryQuery,
  (entities, query) => query
    ? filterEntitiesByCategories(entities, query)
    : entities
);
const selectMeasuresByConnectedCategories = createSelector(
  selectMeasuresByCategories,
  selectConnections,
  selectConnectedCategoryQuery,
  (entities, connections, query) => query
    ? filterEntitiesByConnectedCategories(entities, connections, query)
    : entities
);

const selectMeasuresExpandables = createSelector(
  selectMeasuresByConnectedCategories,
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
// 3. selectMeasuresNested will nest related entities
// 4. selectMeasuresWithout will filter by absence of taxonomy or connection
// 5. selectMeasuresByConnections will filter by specific connection
// 6. selectMeasuresByCategories will filter by specific categories
// 7. selectMeasuresByCOnnectedCategories will filter by specific categories connected via connection
export const selectMeasures = createSelector(
  selectMeasuresExpandables,
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
