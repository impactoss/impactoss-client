import { createSelector } from 'reselect';
import { Map } from 'immutable';

import {
  selectEntities,
  selectRecommendationsSearchQuery,
  selectWithoutQuery,
  selectConnectionQuery,
  selectCategoryQuery,
  selectSortByQuery,
  selectSortOrderQuery,
  selectRecommendationConnections,
  selectFWTaxonomiesSorted,
  selectFWMeasures,
  selectFWIndicators,
  selectFrameworkQuery,
  selectFrameworkListQuery,
  selectReady,
  selectRecommendationCategoriesByRecommendation,
  selectMeasureCategoriesByMeasure,
  selectRecommendationMeasuresByRecommendation,
  selectRecommendationIndicatorsByRecommendation,
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesWithoutAssociation,
  prepareTaxonomiesMultiple,
  entitiesSetCategoryIds,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG, DEPENDENCIES } from './constants';

const selectRecommendationsQ = createSelector(
  (state, locationQuery) => selectRecommendationsSearchQuery(state, {
    searchAttributes: CONFIG.search || ['reference', 'title'],
    locationQuery,
  }),
  (entities) => entities
);
const selectRecommendationsWithCategories = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectRecommendationsQ,
  (state) => selectRecommendationCategoriesByRecommendation(state),
  (state) => selectEntities(state, 'categories'),
  (ready, entities, associationsGrouped, categories) => {
    if (ready) {
      return entitiesSetCategoryIds(
        entities,
        associationsGrouped,
        categories,
      );
    }
    return entities;
  }
);
const selectRecommendationsWithMeasures = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectRecommendationsWithCategories,
  (state) => selectRecommendationConnections(state),
  selectRecommendationMeasuresByRecommendation,
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
const selectRecommendationsWithIndicators = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectRecommendationsWithMeasures,
  (state) => selectRecommendationConnections(state),
  selectRecommendationIndicatorsByRecommendation,
  (ready, entities, connections, associationsGrouped) => {
    if (ready && connections.get('indicators')) {
      return entities.map(
        (entity) => entity.set(
          'indicators',
          associationsGrouped.get(parseInt(entity.get('id'), 10)),
        )
      );
    }
    return entities;
  }
);
const selectRecommendationsByFw = createSelector(
  selectRecommendationsWithIndicators,
  selectFrameworkQuery,
  selectFrameworkListQuery,
  (entities, fwQuery, listQuery) => fwQuery === 'all'
    && listQuery
    ? entities.filter(
      (entity) => qe(
        entity.getIn(['attributes', 'framework_id']),
        listQuery,
      )
    )
    : entities
);
const selectRecommendationsWithout = createSelector(
  selectRecommendationsByFw,
  (state) => selectEntities(state, 'categories'),
  selectWithoutQuery,
  (entities, categories, query) => query
    ? filterEntitiesWithoutAssociation(entities, categories, query)
    : entities
);
const selectRecommendationsByConnections = createSelector(
  selectRecommendationsWithout,
  selectConnectionQuery,
  (entities, query) => query
    ? filterEntitiesByConnection(entities, query)
    : entities
);
const selectRecommendationsByCategories = createSelector(
  selectRecommendationsByConnections,
  selectCategoryQuery,
  (entities, query) => query
    ? filterEntitiesByCategories(entities, query)
    : entities
);
// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearchQuery filters by keyword
// 3. selectRecommendationsNested will nest related entities
// 4. selectRecommendationsWithout will filter by absence of taxonomy or connection
// 5. selectRecommendationsByConnections will filter by specific connection
// 6. selectRecommendationsByCategories will filter by specific categories
export const selectRecommendations = createSelector(
  selectRecommendationsByCategories,
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

export const selectConnectedTaxonomies = createSelector(
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => prepareTaxonomiesMultiple(
    taxonomies,
    categories,
    ['tags_measures'],
  )
);

const selectConnectionsIndicators = createSelector(
  selectFWIndicators,
  (indicators) => Map().set('indicators', indicators)
);

export const selectConnections = createSelector(
  (state) => selectReady(state, { path: DEPENDENCIES }),
  selectConnectionsIndicators,
  selectFWMeasures,
  selectMeasureCategoriesByMeasure,
  (ready, connections, measures, associationsGrouped) => {
    if (ready) {
      return connections.set(
        'measures',
        entitiesSetCategoryIds(
          measures,
          associationsGrouped,
        )
      );
    }
    return connections;
  }
);
