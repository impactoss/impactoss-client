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
  (state) => selectEntities(state, 'measures'),
  (indicators, measures) => ({
    indicators,
    measures,
  })
);

const selectSdgTargetsNested = createSelector(
  (state) => selectEntitiesSearch(state, {
    path: 'sdgtargets',
    searchAttributes: ['title', 'reference'],
  }),
  (state) => selectConnections(state),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (entities, connections, entityCategories, entityIndicators, entityMeasures) =>
    entities.map((entity) => entity
    .set(
      'categories',
      entityCategories.filter((association) => attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), entity.get('id')))
    )
    .set(
      'indicators',
      entityIndicators.filter((association) =>
        attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), entity.get('id'))
        && connections.indicators.get(association.getIn(['attributes', 'indicator_id']).toString())
      )
    )
    .set(
      'measures',
      entityMeasures.filter((association) =>
        attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), entity.get('id'))
        && connections.measures.get(association.getIn(['attributes', 'measure_id']).toString())
      )
    )
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
  selectLocationQuery,
  (entities, query) => query
    ? filterEntitiesByConnection(entities, query, [
      {
        path: 'indicators',
        key: 'indicator_id',
      },
      {
        path: 'measures',
        key: 'measure_id',
      },
    ])
    : entities
);
const selectSdgTargetsByCategories = createSelector(
  selectSdgTargetsByConnections,
  selectCategoryQuery,
  (entities, query) => query
    ? filterEntitiesByCategories(entities, query)
    : entities
);

// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearch filters by keyword
// 3. selectSdgTargetsNested will nest related entities
// 4. selectSdgTargetsWithout will filter by absence of taxonomy or connection
// 5. selectSdgTargetsByConnections will filter by specific connection
// 6. selectSdgTargetsByCategories will filter by specific categories
export const selectSdgTargets = selectSdgTargetsByCategories;

export const selectTaxonomies = createSelector(
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => taxonomies
    .filter((taxonomy) => taxonomy.getIn(['attributes', 'tags_sdgtargets']))
    .map((taxonomy) => taxonomy.set(
      'categories',
      categories.filter((category) => attributesEqual(category.getIn(['attributes', 'taxonomy_id']), taxonomy.get('id')))
    ))
);
//
// // define selects for getEntities
// const selects = {
//   entities: {
//     path: 'sdgtargets',
//     extensions: [
//       {
//         path: 'sdgtarget_categories',
//         key: 'sdgtarget_id',
//         reverse: true,
//         as: 'taxonomies',
//       },
//       {
//         path: 'sdgtarget_indicators',
//         key: 'sdgtarget_id',
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
//               path: 'sdgtarget_indicators',
//               key: 'indicator_id',
//               reverse: true,
//               as: 'sdgtargets',
//               extend: {
//                 path: 'sdgtargets',
//                 key: 'sdgtarget_id',
//                 as: 'sdgtarget',
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
//       {
//         path: 'sdgtarget_measures',
//         key: 'sdgtarget_id',
//         reverse: true,
//         as: 'measures',
//         connected: {
//           path: 'measures',
//           key: 'measure_id',
//           forward: true,
//         },
//       },
//     ],
//   },
//   connections: {
//     options: ['indicators', 'measures'],
//   },
//   connectedTaxonomies: { // filter by each category
//     options: [
//       {
//         out: 'js',
//         path: 'taxonomies',
//         where: {
//           tags_measures: true,
//         },
//         extend: {
//           path: 'categories',
//           key: 'taxonomy_id',
//           reverse: true,
//           extend: {
//             path: 'measure_categories',
//             key: 'category_id',
//             reverse: true,
//             as: 'measures',
//           },
//         },
//       },
//     ],
//   },
//   taxonomies: { // filter by each category
//     out: 'js',
//     path: 'taxonomies',
//     where: {
//       tags_sdgtargets: true,
//     },
//     extend: {
//       path: 'categories',
//       key: 'taxonomy_id',
//       reverse: true,
//     },
//   },
// };
