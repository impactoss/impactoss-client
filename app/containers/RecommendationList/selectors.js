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
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesWithoutAssociation,
  prepareTaxonomiesMultiple,
  entitiesSetCategoryIds,
  getEntityConnections,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG } from './constants';

const selectRecommendationsQ = createSelector(
  (state, locationQuery) => selectRecommendationsSearchQuery(state, {
    searchAttributes: CONFIG.search || ['reference', 'title'],
    locationQuery,
  }),
  (entities) => entities
);
const selectRecommendationsWithCategories = createSelector(
  selectRecommendationsQ,
  (state) => selectEntities(state, 'recommendation_categories'),
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
        'recommendation_id',
        entityCategories,
        categories,
      );
    }
    return entities;
  }
);
const selectRecommendationsWithMeasures = createSelector(
  selectRecommendationsWithCategories,
  (state) => selectRecommendationConnections(state),
  (state) => selectEntities(state, 'recommendation_measures'),
  (entities, connections, entityMeasures) => {
    if (
      connections.get('measures')
      && entityMeasures
      && entityMeasures.size > 0
    ) {
      return entities.map(
        (entity) => entity.set(
          'measures',
          getEntityConnections(
            entity.get('id'),
            entityMeasures,
            'measure_id',
            'recommendation_id',
            connections.get('measures'),
          )
        )
      );
    }
    return entities;
  }
);
const selectRecommendationsWithIndicators = createSelector(
  selectRecommendationsWithMeasures,
  (state) => selectRecommendationConnections(state),
  (state) => selectEntities(state, 'recommendation_indicators'),
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
            'recommendation_id',
            connections.get('indicators'),
          )
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
  selectConnectionsIndicators,
  selectFWMeasures,
  (state) => selectEntities(state, 'measure_categories'),
  (connections, measures, measureCategories) => {
    if (
      measures
      && measures.size > 0
      && measureCategories
      && measureCategories.size > 0
    ) {
      return connections.set(
        'measures',
        entitiesSetCategoryIds(
          measures,
          'measure_id',
          measureCategories,
        )
      );
    }
    return connections;
  }
);
