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
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'sdgtargets'),
  (measures, sdgtargets) => ({
    measures,
    sdgtargets,
  })
);

const selectIndicatorsNested = createSelector(
  (state) => selectEntitiesSearch(state, {
    path: 'indicators',
    searchAttributes: ['title', 'reference'],
  }),
  (state) => selectConnections(state),
  (state) => selectEntities(state, 'measure_indicators'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (entities, connections, entityMeasures, entitySdgTargets) =>
    entities.map((entity) => entity
    .set(
      'measures',
      entityMeasures.filter((association) =>
        attributesEqual(association.getIn(['attributes', 'indicator_id']), entity.get('id'))
        && connections.measures.get(association.getIn(['attributes', 'measure_id']).toString())
      )
    )
    .set(
      'sdgtargets',
      entitySdgTargets.filter((association) =>
        attributesEqual(association.getIn(['attributes', 'indicator_id']), entity.get('id'))
        && connections.sdgtargets.get(association.getIn(['attributes', 'sdgtarget_id']).toString())
      )
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
  selectLocationQuery,
  (entities, query) => query
    ? filterEntitiesByConnection(entities, query, [
      {
        path: 'measures',
        key: 'measure_id',
      },
      {
        path: 'sdgtargets',
        key: 'sdgtarget_id',
      },
    ])
    : entities
);
const selectIndicatorsByCategories = createSelector(
  selectIndicatorsByConnections,
  selectCategoryQuery,
  (entities, query) => query
    ? filterEntitiesByCategories(entities, query)
    : entities
);

// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearch filters by keyword
// 3. selectIndicatorsNested will nest related entities
// 4. selectIndicatorsWithout will filter by absence of taxonomy or connection
// 5. selectIndicatorsByConnections will filter by specific connection
// 6. selectIndicatorsByCategories will filter by specific categories
export const selectIndicators = selectIndicatorsByCategories;

// define selects for getEntities
// const selects = {
//   entities: {
//     path: 'indicators',
//     extensions: [
//       {
//         path: 'measure_indicators',
//         key: 'indicator_id',
//         reverse: true,
//         as: 'measures',
//         connected: {
//           path: 'measures',
//           key: 'measure_id',
//           forward: true,
//         },
//       },
//       {
//         path: 'sdgtarget_indicators',
//         key: 'indicator_id',
//         reverse: true,
//         as: 'sdgtargets',
//         connected: {
//           path: 'sdgtargets',
//           key: 'sdgtarget_id',
//           forward: true,
//         },
//       },
//       {
//         type: 'single',
//         path: 'users',
//         key: 'manager_id',
//         as: 'manager',
//       },
//       {
//         path: 'progress_reports',
//         key: 'indicator_id',
//         reverse: true,
//         as: 'reports',
//       },
//       {
//         path: 'due_dates',
//         key: 'indicator_id',
//         reverse: true,
//         as: 'dates',
//         without: {
//           path: 'progress_reports',
//           key: 'due_date_id',
//         },
//       },
//     ],
//   },
//   connections: {
//     options: ['measures', 'sdgtargets'],
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
