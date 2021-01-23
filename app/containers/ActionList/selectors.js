import { createSelector } from 'reselect';
import { Map, List } from 'immutable';

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
  filterTaxonomies,
  getEntityConnections,
  getEntityConnectionsByFw,
  getTaxonomyCategories,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';
import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG } from './constants';

const selectConnectionsIndicators = createSelector(
  selectFWIndicators,
  (indicators) => Map().set('indicators', indicators)
);

export const selectConnections = createSelector(
  selectConnectionsIndicators,
  selectFWRecommendations,
  (state) => selectEntities(state, 'recommendation_categories'),
  (state) => selectEntities(state, 'categories'),
  (connections, recommendations, recommendationCategories, categories) => {
    if (
      recommendations
      && recommendations.size > 0
      && recommendationCategories
      && recommendationCategories.size > 0
      && categories
      && categories.size > 0
    ) {
      return connections.set(
        'recommendations',
        entitiesSetCategoryIds(
          recommendations,
          'recommendation_id',
          recommendationCategories,
          categories,
        )
      );
    }
    return connections;
  }
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
    const relationship = {
      tags: 'tags_recommendations',
      path: 'recommendations',
      key: 'recommendation_id',
      associations: categoryRecommendations,
    };
    const measureFrameworks = frameworks.filter(
      (fw) => fw.getIn(['attributes', 'has_measures'])
    );
    // for all connections
    const connectedTaxonomies = filterTaxonomies(
      taxonomies,
      relationship.tags,
      true,
    ).filter(
      (taxonomy) => fwTaxonomies.some(
        (fwt) => measureFrameworks.some(
          (fw) => qe(
            fw.get('id'),
            fwt.getIn(['attributes', 'framework_id']),
          ),
        ) && qe(
          taxonomy.get('id'),
          fwt.getIn(['attributes', 'taxonomy_id']),
        )
      )
    );
    if (
      !connections.get(relationship.path)
      || !categoryRecommendations
      || categoryRecommendations.size === 0
      || !categories
      || categories.size === 0
    ) {
      return connectedTaxonomies;
    }
    const groupedAssociations = relationship.associations.filter(
      (association) => association.getIn(['attributes', relationship.key])
        && connections.getIn([
          relationship.path,
          association.getIn(['attributes', relationship.key]).toString(),
        ])
    ).groupBy(
      (association) => association.getIn(['attributes', 'category_id'])
    );
    return connectedTaxonomies.map(
      (taxonomy) => taxonomy.set(
        'categories',
        getTaxonomyCategories(
          taxonomy,
          categories,
          relationship,
          groupedAssociations,
        )
      )
    );
  }
);

const selectMeasuresNestedQ = createSelector(
  (state, locationQuery) => selectMeasuresSearchQuery(state, {
    searchAttributes: CONFIG.search || ['title'],
    locationQuery,
  }),
  (entities) => entities
);

// nest category ids
const selectMeasuresNestedWithCategories = createSelector(
  selectMeasuresNestedQ,
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'categories'),
  (entities, entityCategories, categories) => {
    if (
      entityCategories
      && entityCategories.size > 0
      && categories
      && categories.size > 0
    ) {
      return entitiesSetCategoryIds(
        entities,
        'measure_id',
        entityCategories,
        categories,
      );
    }
    return entities;
  }
);

// nest connected recommendation ids
// nest connected recommendation ids byfw
const selectMeasuresNestedWithRecs = createSelector(
  selectMeasuresNestedWithCategories,
  (state) => selectConnections(state),
  (state) => selectEntities(state, 'recommendation_measures'),
  (entities, connections, entityRecommendations) => {
    if (
      connections.get('recommendations')
      && entityRecommendations
      && entityRecommendations.size > 0
    ) {
      // currently requires both for filtering & display
      return entities.map(
        (entity) => {
          const connectionsByFw = getEntityConnectionsByFw(
            entity.get('id'),
            entityRecommendations,
            'recommendation_id',
            'measure_id',
            connections.get('recommendations'),
          );
          return entity.set(
            'recommendations',
            connectionsByFw && connectionsByFw.flatten(),
          ).set(
            'recommendationsByFw',
            connectionsByFw,
          );
        }
      );
    }
    return entities;
  }
);

// nest connected indicator ids
const selectMeasuresNested = createSelector(
  selectMeasuresNestedWithRecs,
  (state) => selectConnections(state),
  (state) => selectEntities(state, 'measure_indicators'),
  (entities, connections, entityIndicators) => {
    if (
      connections.get('indicators')
      && entityIndicators
      && entityIndicators.size > 0
    ) {
      return entities.map(
        (entity) => entity.set(
          'indicators',
          getEntityConnections(
            entity.get('id'),
            entityIndicators,
            'indicator_id',
            'measure_id',
            connections.get('indicators'),
          )
        )
      );
    }
    return entities;
  }
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

const countDueDates = (dates, attr) => dates.filter(
  (date) => date.getIn(['attributes', attr])
).size;

const selectMeasuresExpandables = createSelector(
  selectMeasuresByConnectedCategories,
  selectFWIndicators,
  (state) => selectEntities(state, 'progress_reports'),
  (state) => selectEntities(state, 'due_dates'),
  selectExpandQuery,
  (entities, indicators, reports, dueDates, expandNo) => entities.map(
    (entity) => {
      // if not expanded
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
        return entity.set(
          'expandable',
          List(['indicators', 'reports']),
        ).set(
          'reports',
          reports.filter(
            (report) => testEntityEntityAssociation(
              entity,
              'indicators',
              report.getIn(['attributes', 'indicator_id']),
            )
          ),
        ).set(
          'dates',
          Map().set(
            'overdue', countDueDates(dueDatesAnyIndicator, 'overdue'),
          ).set(
            'due', countDueDates(dueDatesAnyIndicator, 'due'),
          )
        );
      }
      const filteredIndicators = indicators.filter(
        (indicator) => testEntityEntityAssociation(
          entity,
          'indicators',
          indicator.get('id'),
        )
      );
      // insert expanded indicators with expandable reports (incl due_dates)
      return entity.set(
        'expanded',
        'indicatorsExpanded',
      ).set(
        'indicatorsExpanded',
        filteredIndicators.map(
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
              return indicator.set(
                'expandable',
                'reports',
              ).set(
                'reports',
                reportsForIndicator,
              ).set(
                'dates',
                // store counts
                Map().set(
                  'overdue', countDueDates(dueDatesForIndicator, 'overdue'),
                ).set(
                  'due', countDueDates(dueDatesForIndicator, 'due'),
                )
              );
            }
            const dueDatesScheduled = dueDatesForIndicator && dueDatesForIndicator.filter(
              (date) => !date.getIn(['attributes', 'has_progress_report'])
            );
            return indicator.set(
              'expanded',
              'reports',
            ).set(
              'reports',
              entitiesSetSingle(
                reportsForIndicator,
                dueDates,
                'date',
                'due_date_id',
              )
            ).set(
              'dates',
              // store upcoming scheduled indicator
              Map().set('scheduled', dueDatesScheduled && sortEntities(
                dueDatesScheduled,
                'asc',
                'due_date',
                'date'
              ).first()),
            );
          }
        )
      );
    }
  )
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
