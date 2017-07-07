import { createSelector } from 'reselect';
import { Map } from 'immutable';

import {
  selectEntities,
  selectEntitiesSearch,
  selectWithoutQuery,
  selectConnectionQuery,
  selectCategoryQuery,
  selectSortByQuery,
  selectSortOrderQuery,
} from 'containers/App/selectors';

import {
  filterEntitiesByConnection,
  filterEntitiesByCategories,
  filterEntitiesWithoutAssociation,
  attributesEqual,
  sortEntities,
} from 'containers/App/selector-utils';

export const selectConnections = createSelector(
  (state) => selectEntities(state, 'measures'),
  (measures) => Map().set('measures', measures)
);

export const selectTaxonomies = createSelector(
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => taxonomies
    .filter((taxonomy) => taxonomy.getIn(['attributes', 'tags_recommendations']))
    .map((taxonomy) => taxonomy.set(
      'categories',
      categories.filter((category) => attributesEqual(category.getIn(['attributes', 'taxonomy_id']), taxonomy.get('id')))
    ))
);

const selectRecommendationsNested = createSelector(
  (state) => selectEntitiesSearch(state, {
    path: 'recommendations',
    searchAttributes: ['reference', 'title'],
  }),
  (state) => selectConnections(state),
  (state) => selectEntities(state, 'recommendation_categories'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (entities, connections, entityCategories, entityMeasures) =>
    entities.map((entity) => entity
      .set(
        'categories',
        entityCategories.filter((association) => attributesEqual(association.getIn(['attributes', 'recommendation_id']), entity.get('id')))
      )
      .set(
        'measures',
        entityMeasures.filter((association) =>
          attributesEqual(association.getIn(['attributes', 'recommendation_id']), entity.get('id'))
          && connections.getIn(['measures', association.getIn(['attributes', 'measure_id']).toString()])
        )
      )
    )
);
const selectRecommendationsWithout = createSelector(
  selectRecommendationsNested,
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
    ? filterEntitiesByConnection(entities, query, [{
      path: 'measures',
      key: 'measure_id',
    }])
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
// 2. selectEntitiesSearch filters by keyword
// 3. selectRecommendationsNested will nest related entities
// 4. selectRecommendationsWithout will filter by absence of taxonomy or connection
// 5. selectRecommendationsByConnections will filter by specific connection
// 6. selectRecommendationsByCategories will filter by specific categories
export const selectRecommendations = createSelector(
  selectRecommendationsByCategories,
  selectSortByQuery,
  selectSortOrderQuery,
  (entities, sortBy, sortOrder) =>
    sortEntities(entities, sortOrder || 'asc', sortBy || 'reference')
);
