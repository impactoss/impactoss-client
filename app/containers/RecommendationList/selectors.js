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

export const selectConnections = createSelector(
  (state) => selectEntities(state, 'measures'),
  (measures) => ({ measures })
);

const selectRecommendationsNested = createSelector(
  (state) => selectEntitiesSearch(state, {
    path: 'recommendations',
    searchAttributes: ['reference', 'title'],
  }),
  (state) => selectEntities(state, 'recommendation_categories'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'measures'),
  (recommendations, recCategories, recMeasures, measures) =>
    recommendations.map((recommendation) => recommendation
      .set(
        'categories',
        recCategories.filter((recCat) => attributesEqual(recCat.getIn(['attributes', 'recommendation_id']), recommendation.get('id')))
      )
      .set(
        'measures',
        recMeasures.filter((recMeasure) =>
          attributesEqual(recMeasure.getIn(['attributes', 'recommendation_id']), recommendation.get('id'))
          && measures.get(recMeasure.getIn(['attributes', 'measure_id']).toString())
        )
      )
    )
);
const selectRecommendationsWithout = createSelector(
  selectRecommendationsNested,
  (state) => selectEntities(state, 'categories'),
  selectWithoutQuery,
  (recommendations, categories, query) => query
    ? filterEntitiesWithoutAssociation(recommendations, categories, query)
    : recommendations
);
const selectRecommendationsByConnections = createSelector(
  selectRecommendationsWithout,
  selectLocationQuery,
  (recommendations, query) => query
    ? filterEntitiesByConnection(recommendations, query, [{
      path: 'measures',
      key: 'measure_id',
    }])
    : recommendations
);
const selectRecommendationsByCategories = createSelector(
  selectRecommendationsByConnections,
  selectCategoryQuery,
  (recommendations, query) => query
    ? filterEntitiesByCategories(recommendations, query)
    : recommendations
);

// kicks off series of cascading selectors
// 1. selectEntitiesWhere filters by attribute
// 2. selectEntitiesSearch filters by keyword
// 3. selectRecommendationsNested will nest related entities
// 4. selectRecommendationsWithout will filter by absence of taxonomy or connection
// 5. selectRecommendationsByConnections will filter by specific connection
// 6. selectRecommendationsByCategories will filter by specific categories
export const selectRecommendations = selectRecommendationsByCategories;
