import { createSelector } from 'reselect';

import {
  selectEntities,
  selectEntitiesSearch,
  selectWithoutQuery,
  selectLocationQuery,
  selectCategoryQuery,
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesWithoutAssociation,
  attributesEqual,
} from 'containers/App/selector-utils';

export const selectConnectedTaxonomies = () => null;

export const selectConnections = createSelector(
  (state) => selectEntities(state, 'indicators'),
  (state) => selectEntities(state, 'recommendations'),
  (state) => selectEntities(state, 'sdgtargets'),
  (indicators, recommendations, sdgtargets) => ({
    indicators,
    recommendations,
    sdgtargets,
  })
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
  (entities, connections, entityCategories, entityIndicators, entityRecommendations, entitySdgTargets) =>
    entities.map((entity) => entity
    .set(
      'categories',
      entityCategories.filter((association) => attributesEqual(association.getIn(['attributes', 'measure_id']), entity.get('id')))
    )
    .set(
      'indicators',
      entityIndicators.filter((association) =>
        attributesEqual(association.getIn(['attributes', 'measure_id']), entity.get('id'))
        && connections.indicators.get(association.getIn(['attributes', 'indicator_id']).toString())
      )
    )
    .set(
      'recommendations',
      entityRecommendations.filter((association) =>
        attributesEqual(association.getIn(['attributes', 'measure_id']), entity.get('id'))
        && connections.recommendations.get(association.getIn(['attributes', 'recommendation_id']).toString())
      )
    )
    .set(
      'sdgtargets',
      entitySdgTargets.filter((association) =>
        attributesEqual(association.getIn(['attributes', 'measure_id']), entity.get('id'))
        && connections.sdgtargets.get(association.getIn(['attributes', 'sdgtarget_id']).toString())
      )
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

// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearch filters by keyword
// 3. selectMeasuresNested will nest related entities
// 4. selectMeasuresWithout will filter by absence of taxonomy or connection
// 5. selectMeasuresByConnections will filter by specific connection
// 6. selectMeasuresByCategories will filter by specific categories
export const selectMeasures = selectMeasuresByCategories;

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


// define selects for getEntities
// const selects = {
//   entities: {
//     path: 'measures',
//     extensions: [
//       {
//         path: 'measure_categories',
//         key: 'measure_id',
//         reverse: true,
//         as: 'taxonomies',
//       },
//       {
//         path: 'recommendation_measures',
//         key: 'measure_id',
//         reverse: true,
//         as: 'recommendations',
//         // extend: {
//         //   path: 'recommendations',
//         //   key: 'recommendation_id',
//         //   as: 'recommendation',
//         //   type: 'single',
//         // },
//         connected: {
//           path: 'recommendations',
//           key: 'recommendation_id',
//           forward: true,
//         },
//       },
//       {
//         path: 'sdgtarget_measures',
//         key: 'measure_id',
//         reverse: true,
//         as: 'sdgtargets',
//         connected: {
//           path: 'sdgtargets',
//           key: 'sdgtarget_id',
//           forward: true,
//         },
//       },
//       {
//         path: 'measure_indicators',
//         key: 'measure_id',
//         reverse: true,
//         as: 'indicators',
//         connected: {
//           path: 'indicators',
//           key: 'indicator_id',
//           forward: true,
//         },
//         extend: {
//           path: 'indicators',
//           key: 'indicator_id',
//           as: 'indicator',
//           type: 'single',
//           extend: expandNo ? [
//             {
//               path: 'progress_reports',
//               key: 'indicator_id',
//               reverse: true,
//               as: 'reports',
//             },
//             {
//               path: 'due_dates',
//               key: 'indicator_id',
//               reverse: true,
//               as: 'dates',
//               without: {
//                 path: 'progress_reports',
//                 key: 'due_date_id',
//               },
//             },
//             {
//               path: 'measure_indicators',
//               key: 'indicator_id',
//               reverse: true,
//               as: 'measures',
//               extend: {
//                 path: 'measures',
//                 key: 'measure_id',
//                 as: 'measure',
//                 type: 'single',
//               },
//             },
//           ] : [
//             {
//               path: 'progress_reports',
//               key: 'indicator_id',
//               reverse: true,
//               as: 'reports',
//             },
//             {
//               path: 'due_dates',
//               key: 'indicator_id',
//               reverse: true,
//               as: 'dates',
//               without: {
//                 path: 'progress_reports',
//                 key: 'due_date_id',
//               },
//             },
//           ],
//         },
//       },
//     ],
//   },
//   connections: {
//     options: ['indicators', 'recommendations', 'sdgtargets'],
//   },
//   taxonomies: { // filter by each category
//     out: 'js',
//     path: 'taxonomies',
//     where: {
//       tags_measures: true,
//     },
//     extend: {
//       path: 'categories',
//       key: 'taxonomy_id',
//       reverse: true,
//     },
//   },
//   connectedTaxonomies: { // filter by each category
//     options: [
//       {
//         out: 'js',
//         path: 'taxonomies',
//         where: {
//           tags_recommendations: true,
//         },
//         extend: {
//           path: 'categories',
//           key: 'taxonomy_id',
//           reverse: true,
//           extend: {
//             path: 'recommendation_categories',
//             key: 'category_id',
//             reverse: true,
//             as: 'recommendations',
//           },
//         },
//       },
//       {
//         out: 'js',
//         path: 'taxonomies',
//         where: {
//           tags_sdgtargets: true,
//         },
//         extend: {
//           path: 'categories',
//           key: 'taxonomy_id',
//           reverse: true,
//           extend: {
//             path: 'sdgtarget_categories',
//             key: 'category_id',
//             reverse: true,
//             as: 'sdgtargets',
//           },
//         },
//       },
//     ],
//   },
// };
