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
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesByConnectedCategories,
  filterEntitiesWithoutAssociation,
  attributesEqual,
} from 'containers/App/selector-utils';

export const selectConnections = createSelector(
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'sdgtargets'),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (measures, sdgtargets, measureCategories, sdgtargetCategories) => ({
    measures: measures.map((measure) =>
      measure.set(
        'categories',
        measureCategories.filter((association) =>
          attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
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
          .filter((taxonomy) => taxonomy.getIn(['attributes', connection.tags]) && !taxonomy.getIn(['attributes', 'tags_indicators']))
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

const selectIndicatorsNested = createSelector(
  (state) => selectEntitiesSearch(state, {
    path: 'indicators',
    searchAttributes: ['title', 'reference'],
  }),
  (state) => selectConnections(state),
  (state) => selectEntities(state, 'measure_indicators'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (state) => selectEntities(state, 'progress_reports'),
  (state) => selectEntities(state, 'due_dates'),
  (
    entities,
    connections,
    entityMeasures,
    entitySdgTargets,
    progressReports,
    dueDates,
  ) =>
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
    // nest reports
    .set('reports', progressReports.filter((report) =>
      attributesEqual(report.getIn(['attributes', 'indicator_id']), entity.get('id'))
    ))
    // nest dates without report
    .set(
      'dates',
      dueDates
      .filter((date) => {
        // is associated
        const associated = attributesEqual(date.getIn(['attributes', 'indicator_id']), entity.get('id'));
        if (associated) {
          // has no report
          const dateReports = progressReports.filter((report) => attributesEqual(report.getIn(['attributes', 'due_date_id']), date.get('id')));
          return !dateReports || dateReports.size === 0;
        }
        return false;
      }
    ))
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
const selectIndicatorsByConnectedCategories = createSelector(
  selectIndicatorsByCategories,
  selectConnections,
  selectConnectedCategoryQuery,
  (entities, connections, query) => query
    ? filterEntitiesByConnectedCategories(entities, connections, query, {
      measures: 'measure_id',
      sdgtargets: 'sdgtarget_id',
    })
    : entities
);
// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearch filters by keyword
// 3. selectIndicatorsNested will nest related entities
// 4. selectIndicatorsWithout will filter by absence of taxonomy or connection
// 5. selectIndicatorsByConnections will filter by specific connection
// 6. selectIndicatorsByCategories will filter by specific categories
// 7. selectIndicatorsByCOnnectedCategories will filter by specific categories connected via connection
export const selectIndicators = selectIndicatorsByConnectedCategories;

// define selects for getEntities
// const selects = {
//   entities: {
//     path: 'indicators',
//     extensions: [
//       {
//         type: 'single',
//         path: 'users',
//         key: 'manager_id',
//         as: 'manager',
//       },
//       {
