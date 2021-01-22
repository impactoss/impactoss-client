import { createSelector } from 'reselect';
import { Map, List, fromJS } from 'immutable';

import {
  selectEntities,
  selectMeasuresSearchQuery,
  selectWithoutQuery,
  selectConnectionQuery,
  selectCategoryQuery,
  selectConnectedCategoryQuery,
  selectSortByQuery,
  selectSortOrderQuery,
  selectExpandQuery,
  selectFWTaxonomiesSorted,
  selectFWRecommendations,
  selectFWIndicators,
  selectFrameworks,
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesByConnectedCategories,
  filterEntitiesWithoutAssociation,
  testEntityEntityAssociation,
  entitiesSetCategoryIds,
  entitiesSetSingle,
  getEntityCategories,
  filterTaxonomies,
  getEntityConnections,
  getEntityConnectionsByFw,
  getTaxonomyCategories,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';
import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG } from './constants';

export const selectConnections = createSelector(
  selectFWIndicators,
  selectFWRecommendations,
  (state) => selectEntities(state, 'recommendation_categories'),
  (state) => selectEntities(state, 'categories'),
  (indicators, recommendations, recommendationCategories, categories) => Map()
    .set('indicators', indicators)
    .set('recommendations',
      entitiesSetCategoryIds(
        recommendations,
        'recommendation_id',
        recommendationCategories,
        categories,
      ))
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectConnections(state),
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (state) => selectFrameworks(state),
  (state) => selectEntities(state, 'framework_taxonomies'),
  (
    connections,
    taxonomies,
    categories,
    categoryRecommendations,
    frameworks,
    fwTaxonomies,
  ) => {
    const measureFrameworks = frameworks.filter(
      (fw) => fw.getIn(['attributes', 'has_measures'])
    );
    const relationships = fromJS([
      {
        tags: 'tags_recommendations',
        path: 'recommendations',
        key: 'recommendation_id',
        associations: categoryRecommendations,
      },
    ]);
    // for all connections
    // TODO deal with conflicts
    // merge connected taxonomies.
    return relationships.reduce(
      (memo, relationship) => memo.merge(
        filterTaxonomies(taxonomies, relationship.tags, true).filter(
          (taxonomy) => fwTaxonomies.some(
            (fwt) => qe(
              fwt.getIn(['attributes', 'taxonomy_id']),
              taxonomy.get('id')
            ) && measureFrameworks.some(
              (fw) => qe(
                fwt.getIn(['attributes', 'framework_id']),
                fw.get('id')
              ),
            )
          )
        ).map(
          (taxonomy) => taxonomy.set(
            'categories',
            getTaxonomyCategories(
              taxonomy,
              categories,
              relationship,
              connections.get(relationship.path),
            )
          )
        )
      ),
      Map(),
    );
  }
);

const selectMeasuresNested = createSelector(
  (state, locationQuery) => selectMeasuresSearchQuery(state, {
    searchAttributes: CONFIG.search || ['title'],
    locationQuery,
  }),
  (state) => selectConnections(state),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'measure_indicators'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'categories'),
  (
    entities,
    connections,
    entityCategories,
    entityIndicators,
    entityRecommendations,
    categories,
  ) => entities.map((entity) => entity
    // nest category ids
    .set('categories', getEntityCategories(
      entity.get('id'),
      entityCategories,
      'measure_id',
      categories,
    ))
    // nest connected recommendation ids
    .set('recommendations', getEntityConnections(
      entity.get('id'),
      entityRecommendations,
      'recommendation_id',
      'measure_id',
      connections.get('recommendations'),
    ))
    // nest connected recommendation ids byfw
    .set('recommendationsByFw', getEntityConnectionsByFw(
      entity.get('id'),
      entityRecommendations,
      'recommendation_id',
      'measure_id',
      connections.get('recommendations'),
    ))
    // nest connected indicator ids
    .set('indicators', getEntityConnections(
      entity.get('id'),
      entityIndicators,
      'indicator_id',
      'measure_id',
      connections.get('indicators'),
    )))
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
  selectFWIndicators,
  (state) => selectEntities(state, 'progress_reports'),
  (state) => selectEntities(state, 'due_dates'),
  selectExpandQuery,
  (entities, indicators, reports, dueDates, expandNo) => entities.map((entity) => {
    if (expandNo <= 0) {
      // insert expandables:
      // - indicators
      // - reports (incl due_dates)
      const dueDatesAnyIndicator = dueDates.filter(
        (date) => testEntityEntityAssociation(
          entity,
          'indicators',
          date.getIn(['attributes', 'indicator_id'])
        )
      );
      return entity
        .set('expandable', List(['indicators', 'reports']))
        .set('reports', reports.filter(
          (report) => testEntityEntityAssociation(
            entity,
            'indicators',
            report.getIn(['attributes', 'indicator_id']),
          )
        ))
        .set('dates', Map()
          .set('overdue', dueDatesAnyIndicator.filter(
            (date) => date.getIn(['attributes', 'overdue'])
          ).size)
          .set('due', dueDatesAnyIndicator.filter(
            (date) => date.getIn(['attributes', 'due'])
          ).size));
    }
    // insert expanded indicators with expandable reports (incl due_dates)
    return entity
      .set('expanded', 'indicatorsExpanded')
      .set('indicatorsExpanded', indicators.filter(
        (indicator) => testEntityEntityAssociation(entity, 'indicators', indicator.get('id'))
      ).map(
        (indicator) => {
          // due dates for indicator
          const dueDatesForIndicator = dueDates.filter(
            (date) => qe(
              date.getIn(['attributes', 'indicator_id']),
              indicator.get('id')
            )
          );
          const reportsForIndicator = reports.filter(
            (report) => qe(
              report.getIn(['attributes', 'indicator_id']),
              indicator.get('id')
            )
          );
          if (expandNo === 1) {
            return indicator
              .set('expandable', 'reports')
              .set('reports', reportsForIndicator)
              .set('dates', Map()
                // store counts
                .set('overdue', dueDatesForIndicator.filter(
                  (date) => date.getIn(['attributes', 'overdue'])
                ).size)
                .set('due', dueDatesForIndicator.filter(
                  (date) => date.getIn(['attributes', 'due'])
                ).size));
          }
          const dueDatesScheduled = dueDatesForIndicator && dueDatesForIndicator.filter(
            (date) => !date.getIn(['attributes', 'has_progress_report'])
          );
          return indicator
            .set('expanded', 'reports')
            .set('reports', entitiesSetSingle(
              reportsForIndicator,
              dueDates,
              'date',
              'due_date_id',
            ))
            .set('dates', Map()
              // store upcoming scheduled indicator
              .set('scheduled', dueDatesScheduled && sortEntities(
                dueDatesScheduled,
                'asc',
                'due_date',
                'date'
              ).first()));
        }
      ));
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
