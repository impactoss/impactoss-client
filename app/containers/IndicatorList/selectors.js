import { createSelector } from 'reselect';
import { Map } from 'immutable';
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
  entitiesSetSingle,
} from 'utils/entities';

import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG } from './constants';

export const selectConnections = createSelector(
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'sdgtargets'),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (measures, sdgtargets, measureCategories, sdgtargetCategories) =>
    Map()
    .set(
      'measures',
      measures.map((measure) =>
        measure.set(
          'categories',
          measureCategories
          .filter((association) =>
            attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
          )
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
          .filter((association) =>
            attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), sdgtarget.get('id'))
          )
          .map((association) => association.getIn(['attributes', 'category_id']))
        )
      )
    )
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

const selectIndicatorsNested = createSelector(
  (state, locationQuery) => selectEntitiesSearchQuery(state, {
    path: 'indicators',
    searchAttributes: ['title', 'reference'],
    locationQuery,
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
      entityMeasures
      .filter((association) =>
        attributesEqual(association.getIn(['attributes', 'indicator_id']), entity.get('id'))
        && connections.getIn(['measures', association.getIn(['attributes', 'measure_id']).toString()])
      )
      .map((association) => association.getIn(['attributes', 'measure_id']))
    )
    .set(
      'sdgtargets',
      entitySdgTargets
      .filter((association) =>
        attributesEqual(association.getIn(['attributes', 'indicator_id']), entity.get('id'))
        && connections.getIn(['sdgtargets', association.getIn(['attributes', 'sdgtarget_id']).toString()])
      )
      .map((association) => association.getIn(['attributes', 'sdgtarget_id']))
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
