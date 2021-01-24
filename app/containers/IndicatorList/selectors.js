import { createSelector } from 'reselect';
import { Map } from 'immutable';

import {
  selectEntities,
  selectIndicatorsSearchQuery,
  selectWithoutQuery,
  selectConnectionQuery,
  selectCategoryQuery,
  selectConnectedCategoryQuery,
  selectSortByQuery,
  selectSortOrderQuery,
  selectExpandQuery,
  selectFWTaxonomiesSorted,
  selectFWRecommendations,
  selectFWMeasures,
  selectFrameworks,
  selectReady,
  selectRecommendationCategoriesByRecommendation,
  selectMeasureCategoriesByMeasure,
  selectMeasureIndicatorsByIndicator,
  selectRecommendationIndicatorsByIndicator,
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesByConnectedCategories,
  filterEntitiesWithoutAssociation,
  entitiesSetSingle,
  entitiesSetCategoryIds,
  filterTaxonomies,
  getTaxonomyCategories,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG, DEPENDENCIES } from './constants';

export const selectConnectionsMeasures = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectFWMeasures,
  selectMeasureCategoriesByMeasure,
  (ready, measures, associationsGrouped) => {
    if (ready) {
      return Map().set(
        'measures',
        entitiesSetCategoryIds(
          measures,
          associationsGrouped,
        )
      );
    }
    return Map();
  }
);
export const selectConnections = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectConnectionsMeasures,
  selectFWRecommendations,
  selectRecommendationCategoriesByRecommendation,
  (ready, connections, recommendations, associationsGrouped) => {
    if (ready) {
      return connections.set(
        'recommendations',
        entitiesSetCategoryIds(
          recommendations,
          associationsGrouped,
        )
      );
    }
    return connections;
  }
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  (state) => selectConnections(state),
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (state) => selectFrameworks(state),
  (state) => selectEntities(state, 'framework_taxonomies'),
  (
    ready,
    connections,
    taxonomies,
    categories,
    categoryMeasures,
    categoryRecommendations,
    frameworks,
    fwTaxonomies,
  ) => {
    if (!ready) return Map();
    const indicatorFrameworks = frameworks.filter(
      (fw) => fw.getIn(['attributes', 'has_indicators'])
    );
    const relationships = [
      {
        tags: 'tags_measures',
        path: 'measures',
        key: 'measure_id',
        associations: categoryMeasures,
        needFw: false,
      },
      {
        tags: 'tags_recommendations',
        path: 'recommendations',
        key: 'recommendation_id',
        associations: categoryRecommendations,
        needFw: true,
      },
    ];
    // for all connections
    // TODO deal with conflicts
    // merge connected taxonomies.
    return relationships.reduce(
      (connectedTaxonomies, relationship) => {
        let filtered = filterTaxonomies(taxonomies, relationship.tags, true);
        if (relationship.needFw) {
          filtered = filtered.filter(
            (taxonomy) => fwTaxonomies.some(
              (fwt) => indicatorFrameworks.some(
                (fw) => qe(
                  fwt.getIn(['attributes', 'framework_id']),
                  fw.get('id')
                ),
              ) && qe(
                fwt.getIn(['attributes', 'taxonomy_id']),
                taxonomy.get('id')
              )
            )
          );
        }
        if (
          !connections.get(relationship.path)
          || !relationship.associations
          || relationship.associations.size === 0
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
        return connectedTaxonomies.merge(
          filtered.map(
            (taxonomy) => taxonomy.set(
              'categories',
              getTaxonomyCategories(
                taxonomy,
                categories,
                relationship,
                groupedAssociations,
              )
            )
          )
        );
      },
      Map(),
    );
  }
);

const selectIndicatorsNestedQ = createSelector(
  (state, locationQuery) => selectIndicatorsSearchQuery(state, {
    searchAttributes: CONFIG.search || ['title', 'reference'],
    locationQuery,
  }),
  (entities) => entities
);

// nest connected recommendation ids
// nest connected recommendation ids byfw
const selectIndicatorsNestedWithRecs = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectIndicatorsNestedQ,
  (state) => selectConnections(state),
  selectRecommendationIndicatorsByIndicator,
  (ready, entities, connections, associationsGrouped) => {
    if (ready && connections.get('recommendations')) {
      return entities.map(
        (entity) => {
          const entityRecs = associationsGrouped.get(parseInt(entity.get('id'), 10));
          const entityRecsByFw = entityRecs && entityRecs.filter(
            (recId) => connections.getIn([
              'recommendations',
              recId.toString(),
            ])
          ).groupBy(
            (recId) => connections.getIn([
              'recommendations',
              recId.toString(),
              'attributes',
              'framework_id',
            ])
          );
          // currently requires both for filtering & display
          return entity.set(
            'recommendations',
            entityRecs,
          ).set(
            'recommendationsByFw',
            entityRecsByFw,
          );
        }
      );
    }
    return entities;
  }
);


const selectIndicatorsNestedWithMeasures = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectIndicatorsNestedWithRecs,
  (state) => selectConnections(state),
  selectMeasureIndicatorsByIndicator,
  (ready, entities, connections, associationsGrouped) => {
    if (ready && connections.get('measures')) {
      return entities.map(
        (entity) => entity.set(
          'measures',
          associationsGrouped.get(parseInt(entity.get('id'), 10)),
        )
      );
    }
    return entities;
  }
);
const selectIndicatorsNested = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectIndicatorsNestedWithMeasures,
  (state) => selectEntities(state, 'progress_reports'),
  (state) => selectEntities(state, 'due_dates'),
  (state) => selectEntities(state, 'users'),
  (
    ready,
    entities,
    progressReports,
    dueDates,
    users
  ) => {
    if (ready) {
      return entities.map(
        // nest reports
        (entity) => entity.set(
          'reports',
          progressReports.filter(
            (report) => qe(
              entity.get('id'),
              report.getIn(['attributes', 'indicator_id']),
            )
          )
          // nest dates without report
        ).set(
          'dates',
          dueDates.filter(
            (date) => {
              // is associated
              const associated = qe(date.getIn(['attributes', 'indicator_id']), entity.get('id'));
              if (associated) {
                // has no report
                const dateReports = progressReports.filter((report) => qe(report.getIn(['attributes', 'due_date_id']), date.get('id')));
                return !dateReports || dateReports.size === 0;
              }
              return false;
            }
          )
        ).set(
          'manager',
          users.find(
            (user) => entity.getIn(['attributes', 'manager_id'])
              && qe(
                user.get('id'),
                entity.getIn(['attributes', 'manager_id'])
              )
          )
        )
      );
    }
    return entities;
  }
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
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectIndicatorsByConnectedCategories,
  (state) => selectEntities(state, 'progress_reports'),
  (state) => selectEntities(state, 'due_dates'),
  selectExpandQuery,
  (ready, entities, reports, dueDates, expandNo) => !ready
    ? entities
    : entities.map(
      (entity) => {
        const dueDatesForIndicator = dueDates.filter(
          (date) => qe(
            entity.get('id'),
            date.getIn(['attributes', 'indicator_id'])
          )
        );
        const reportsForIndicator = reports.filter(
          (report) => qe(
            entity.get('id'),
            report.getIn(['attributes', 'indicator_id'])
          )
        );
        if (expandNo <= 0) {
          // insert expandables:
          // - indicators
          // - reports (incl due_dates)
          return entity.set(
            'expandable',
            'reports'
          ).set(
            'reports',
            reportsForIndicator,
          ).set(
            'dates',
            Map().set(
              'overdue',
              dueDatesForIndicator.filter(
                (date) => date.getIn(['attributes', 'overdue'])
              ).size
            ).set(
              'due',
              dueDatesForIndicator.filter(
                (date) => date.getIn(['attributes', 'due'])
              ).size
            )
          );
        }
        // insert expanded indicators with expandable reports (incl due_dates)
        const dueDatesScheduled = dueDatesForIndicator.filter(
          (date) => !date.getIn(['attributes', 'has_progress_report'])
        );
        return entity.set(
          'expanded',
          'reports',
        ).set(
          'reports',
          entitiesSetSingle(reportsForIndicator, dueDates, 'date', 'due_date_id')
        ).set(
          'dates',
          // store upcoming scheduled indicator
          Map().set(
            'scheduled',
            dueDatesScheduled && sortEntities(
              dueDatesScheduled,
              'asc',
              'due_date',
              'date',
            ).first()
          )
        );
      }
    )
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
