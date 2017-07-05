import { createSelector } from 'reselect';
import { Map } from 'immutable';
import { reduce } from 'lodash/collection';

import {
  selectEntities,
  selectEntitiesSearch,
  selectWithoutQuery,
  selectLocationQuery,
  selectCategoryQuery,
  selectConnectedCategoryQuery,
  // selectExpandQuery,
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesByConnectedCategories,
  filterEntitiesWithoutAssociation,
  attributesEqual,
} from 'containers/App/selector-utils';

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
  (indicators, recommendations, sdgtargets, recommendationCategories, sdgtargetCategories) => ({
    indicators,
    recommendations: recommendations.map((recommendation) =>
      recommendation.set(
        'categories',
        recommendationCategories.filter((association) =>
          attributesEqual(association.getIn(['attributes', 'recommendation_id']), recommendation.get('id'))
        )
      )
    ),
    sdgtargets: sdgtargets.map((sdgtarget) =>
      sdgtarget.set(
        'categories',
        sdgtargetCategories.filter((association) =>
          attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), sdgtarget.get('id'))
        )
      )
    ),
  })
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
      // merge connected taxonomies.
      // TODO deal with conflicts
      connectedTaxonomies.merge(
        taxonomies
          .filter((taxonomy) => taxonomy.getIn(['attributes', connection.tags]) && !taxonomy.getIn(['attributes', 'tags_measures']))
          .map((taxonomy) => taxonomy.set(
            'categories',
            categories
              .filter((category) => attributesEqual(category.getIn(['attributes', 'taxonomy_id']), taxonomy.get('id')))
              .map((category) => category.set(
                connection.path,
                connection.associations.filter((association) =>
                  attributesEqual(association.getIn(['attributes', 'category_id']), category.get('id'))
                  && connections[connection.path].get(association.getIn(['attributes', connection.key]).toString())
                )
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
  (state) => selectEntities(state, 'due_dates'),
  // (state) => selectEntities(state, 'measures'),
  // (state) => selectExpandQuery(state),
  (
    entities,
    connections,
    measureCategories,
    measureIndicators,
    measureRecommendations,
    measureSdgTargets,
    progressReports,
    dueDates
    // measures,
    // expandNo
  ) => entities.map((entity) => entity
    // nest categories
    .set(
      'categories',
      measureCategories.filter((association) => attributesEqual(association.getIn(['attributes', 'measure_id']), entity.get('id')))
    )
    // nest recommendations connections
    .set(
      'recommendations',
      measureRecommendations.filter((association) =>
        attributesEqual(association.getIn(['attributes', 'measure_id']), entity.get('id'))
        && connections.recommendations.get(association.getIn(['attributes', 'recommendation_id']).toString())
      )
    )
    // nest sdgtarget connections
    .set(
      'sdgtargets',
      measureSdgTargets.filter((association) =>
        attributesEqual(association.getIn(['attributes', 'measure_id']), entity.get('id'))
        && connections.sdgtargets.get(association.getIn(['attributes', 'sdgtarget_id']).toString())
      )
    )
    // nest indicator connections
    .set(
      'indicators',
      measureIndicators
      .filter((entityIndicator) =>
        attributesEqual(entityIndicator.getIn(['attributes', 'measure_id']), entity.get('id'))
        && connections.indicators.get(entityIndicator.getIn(['attributes', 'indicator_id']).toString())
      )
      .map((entityIndicator) => {
        // nest actual indicator with indicator connection
        const indicator = connections.indicators.get(entityIndicator.getIn(['attributes', 'indicator_id']).toString());
        // if (indicator) {
        return entityIndicator.set(
          'indicator',
          indicator
            // nest reports
            .set('reports', progressReports.filter((report) =>
              attributesEqual(report.getIn(['attributes', 'indicator_id']), indicator.get('id'))
            ))
            // nest dates without report
            .set(
              'dates',
              dueDates
              .filter((date) => {
                // is associated
                const associated = attributesEqual(date.getIn(['attributes', 'indicator_id']), indicator.get('id'));
                if (associated) {
                  // has no report
                  const dateReports = progressReports.filter((report) => attributesEqual(report.getIn(['attributes', 'due_date_id']), date.get('id')));
                  return !dateReports || dateReports.size === 0;
                }
                return false;
              }
            ))
        );
          // if (expandNo) {
          //   // nest connected measures
          //   console.log('nest connected measures')
          //   indicator = indicator.set(
          //     'measures',
          //     measureIndicators
          //       .filter((measureIndicator) =>
          //         attributesEqual(measureIndicator.getIn(['attributes', 'indicator_id']), indicator.get('id'))
          //         && measures.get(entityIndicator.getIn(['attributes', 'measure_id']).toString())
          //       )
          //       .map((measureIndicator) => measureIndicator.set(
          //         'measure',
          //         measures.get(measureIndicator.getIn(['attributes', 'measure_id']).toString())
          //       ))
          //   )
          // }
          // return entityIndicator.set('indicator', indicator)
        // }
        // return entityIndicator
      })
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
  selectLocationQuery,
  (entities, query) => query
    ? filterEntitiesByConnection(entities, query, [
      {
        path: 'indicators',
        key: 'indicator_id',
      },
      {
        path: 'recommendations',
        key: 'recommendation_id',
      },
      {
        path: 'sdgtargets',
        key: 'sdgtarget_id',
      },
    ])
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
    ? filterEntitiesByConnectedCategories(entities, connections, query, {
      recommendations: 'recommendation_id',
      sdgtargets: 'sdgtarget_id',
    })
    : entities
);

// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearch filters by keyword
// 3. selectMeasuresNested will nest related entities
// 4. selectMeasuresWithout will filter by absence of taxonomy or connection
// 5. selectMeasuresByConnections will filter by specific connection
// 6. selectMeasuresByCategories will filter by specific categories
// 7. selectMeasuresByCOnnectedCategories will filter by specific categories connected via connection
export const selectMeasures = selectMeasuresByConnectedCategories;
