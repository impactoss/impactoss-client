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
  getEntityCategories,
  getEntityConnections,
  attributesEqual,
} from 'utils/entities';

import { sortEntities, getSortOption } from 'utils/sort';

import { CONFIG } from './constants';

const selectRecommendationsNested = createSelector(
  (state, locationQuery) => selectRecommendationsSearchQuery(state, {
    searchAttributes: CONFIG.search || ['reference', 'title'],
    locationQuery,
  }),
  (state) => selectRecommendationConnections(state),
  (state) => selectEntities(state, 'recommendation_categories'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'recommendation_indicators'),
  (state) => selectEntities(state, 'categories'),
  (
    entities,
    connections,
    entityCategories,
    entityMeasures,
    entityIndicators,
    categories,
  ) =>
    entities.map((entity) => entity
      .set('categories', getEntityCategories(
        entity.get('id'),
        entityCategories,
        'recommendation_id',
        categories,
      ))
      .set('measures', getEntityConnections(
        entity.get('id'),
        entityMeasures,
        'measure_id',
        'recommendation_id',
        connections.get('measures'),
      ))
      .set('indicators', getEntityConnections(
        entity.get('id'),
        entityIndicators,
        'indicator_id',
        'recommendation_id',
        connections.get('indicators'),
      ))
    )
);
const selectRecommendationsByFw = createSelector(
  selectRecommendationsNested,
  selectFrameworkQuery,
  selectFrameworkListQuery,
  (entities, fwQuery, listQuery) =>
    fwQuery === 'all' &&
    listQuery
      ? entities.filter(
          (entity) => attributesEqual(
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
  (taxonomies, categories) =>
    prepareTaxonomiesMultiple(taxonomies, categories, ['tags_measures'])
);

export const selectConnections = createSelector(
  selectFWIndicators,
  selectFWMeasures,
  (state) => selectEntities(state, 'measure_categories'),
  (indicators, measures, measureCategories) =>
    Map()
    .set('indicators', indicators)
    .set('measures', entitiesSetCategoryIds(measures, 'measure_id', measureCategories))
);
