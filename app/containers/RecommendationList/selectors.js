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

export const selectRecommendationsNested = createSelector(
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
        'taxonomies',
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

export const selectRecommendationsWithout = createSelector(
  selectRecommendationsNested,
  (state) => selectEntities(state, 'categories'),
  selectWithoutQuery,
  (recommendations, categories, query) => query
    ? filterEntitiesWithoutAssociation(recommendations, categories, query)
    : recommendations
);
export const selectRecommendationsByConnections = createSelector(
  selectRecommendationsWithout,
  selectLocationQuery,
  (recommendations, query) => query
    ? filterEntitiesByConnection(recommendations, query, [{
      path: 'measures',
      queryPath: 'actions',
      key: 'measure_id',
    }])
    : recommendations
);
export const selectRecommendationsByCategories = createSelector(
  selectRecommendationsByConnections,
  selectCategoryQuery,
  (recommendations, query) => query
    ? filterEntitiesByCategories(recommendations, query)
    : recommendations
);

export const selectRecommendations = createSelector(
  selectRecommendationsByCategories,
  (recommendations) => recommendations
);
