import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { reduce } from 'lodash/collection';

import {
  selectEntities,
  selectEntitiesSearch,
  selectWithoutQuery,
  selectConnectionQuery,
  selectCategoryQuery,
  selectConnectedCategoryQuery,
  selectSortByQuery,
  selectSortOrderQuery,
  // selectExpandQuery,
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesByConnectedCategories,
  filterEntitiesWithoutAssociation,
  attributesEqual,
  sortEntities,
} from 'utils/entities';

export const selectTaxonomies = createSelector(
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => taxonomies
    .filter((taxonomy) => taxonomy.getIn(['attributes', 'tags_measures']))
    .map((taxonomy) => taxonomy.set(
      'categories',
      categories.filter((category) => attributesEqual(category.getIn(['attributes', 'taxonomy_id']), taxonomy.get('id')))
    ))
);

export const selectConnections = createSelector(
  (state) => selectEntities(state, 'indicators'),
  (state) => selectEntities(state, 'recommendations'),
  (state) => selectEntities(state, 'sdgtargets'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (indicators, recommendations, sdgtargets, recommendationCategories, sdgtargetCategories) =>
    Map()
    .set('indicators', indicators)
    .set(
      'recommendations',
      recommendations.map((recommendation) =>
        recommendation.set(
          'categories',
          recommendationCategories
          .filter((association) => attributesEqual(association.getIn(['attributes', 'recommendation_id']), recommendation.get('id')))
          .map((association) => association.getIn(['attributes', 'category_id']))
        )
      )
    )
    .set(
      'sdgtargets',
      sdgtargets.map((sdgtarget) =>
        sdgtarget.set(
          'categories',
          sdgtargetCategories
          .filter((association) => attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), sdgtarget.get('id')))
          .map((association) => association.getIn(['attributes', 'category_id']))
        )
      )
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
        .filter((taxonomy) => taxonomy.getIn(['attributes', connection.tags]) && !taxonomy.getIn(['attributes', 'tags_measures']))
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
  (state) => selectEntitiesSearch(state, {
    path: 'measures',
    searchAttributes: ['title'],
  }),
  (state) => selectConnections(state),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'measure_indicators'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (state) => selectEntities(state, 'progress_reports'),
  // (state) => selectEntities(state, 'due_dates'),
  (
    entities,
    connections,
    measureCategories,
    measureIndicators,
    measureRecommendations,
    measureSdgTargets,
    // progressReports,
    // dueDates
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
  (entities) => entities
  // (state) => selectExpandQuery(state),
  // (entities, expandNo) => entities
);

// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearch filters by keyword
// 3. selectMeasuresNested will nest related entities
// 4. selectMeasuresWithout will filter by absence of taxonomy or connection
// 5. selectMeasuresByConnections will filter by specific connection
// 6. selectMeasuresByCategories will filter by specific categories
// 7. selectMeasuresByCOnnectedCategories will filter by specific categories connected via connection
export const selectMeasures = createSelector(
  selectMeasuresExpandables,
  selectSortByQuery,
  selectSortOrderQuery,
  (entities, sortBy, sortOrder) =>
    sortEntities(entities, sortOrder || 'asc', sortBy)
);
