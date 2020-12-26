import { createSelector } from 'reselect';
import {
  selectEntity,
  selectEntities,
  selectRecommendationConnections,
  selectIndicatorConnections,
  selectTaxonomiesSorted,
  selectFWRecommendations,
  selectFWIndicators,
} from 'containers/App/selectors';

import {
  entitySetUser,
  attributesEqual,
  entitiesIsAssociated,
  prepareTaxonomiesAssociated,
  getEntityCategories,
} from 'utils/entities';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'measures', id }),
  (state) => selectEntities(state, 'users'),
  (entity, users) => entitySetUser(entity, users)
);

export const selectTaxonomies = createSelector(
  (state, id) => id,
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'measure_categories'),
  (id, taxonomies, categories, associations) =>
    prepareTaxonomiesAssociated(taxonomies, categories, associations, 'tags_measures', 'measure_id', id)
  );

export const selectRecommendationsAssociated = createSelector(
  (state, id) => id,
  selectFWRecommendations,
  (state) => selectEntities(state, 'recommendation_measures'),
  (id, entities, associations) =>
    entitiesIsAssociated(entities, 'recommendation_id', associations, 'measure_id', id)
);
// all connected recommendations
export const selectRecommendations = createSelector(
  selectRecommendationsAssociated,
  selectRecommendationConnections,
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (state) => selectEntities(state, 'recommendation_indicators'),
  (state) => selectEntities(state, 'categories'),
  (recommendations, connections, recMeasures, recCategories, recIndicators, categories) =>
    recommendations && recommendations
    .map((rec) => rec
      .set('categories', getEntityCategories(rec.get('id'), recCategories, 'recommendation_id', categories))
      .set('measures', recMeasures && recMeasures
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'recommendation_id']), rec.get('id'))
          && connections.getIn(['measures', association.getIn(['attributes', 'measure_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'measure_id']))
      )
      .set('indicators', recIndicators
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'recommendation_id']), rec.get('id'))
          && connections.getIn(['indicators', association.getIn(['attributes', 'indicator_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'indicator_id']))
      )
    )
);

export const selectIndicatorsAssociated = createSelector(
  (state, id) => id,
  selectFWIndicators,
  (state) => selectEntities(state, 'measure_indicators'),
  (id, entities, associations) =>
    entitiesIsAssociated(entities, 'indicator_id', associations, 'measure_id', id)
);
// selectIndicators,
export const selectIndicators = createSelector(
  selectIndicatorsAssociated,
  (state) => selectIndicatorConnections(state),
  (state) => selectEntities(state, 'measure_indicators'),
  (state) => selectEntities(state, 'recommendation_indicators'),
  (indicators, connections, indicatorMeasures, indicatorRecs) =>
    indicators && indicators
    .map((indicator) => indicator
      .set('measures', indicatorMeasures && indicatorMeasures
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'indicator_id']), indicator.get('id'))
          && connections.getIn(['measures', association.getIn(['attributes', 'measure_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'measure_id']))
      )
      .set('recommendations', indicatorRecs
        .filter((association) =>
        attributesEqual(association.getIn(['attributes', 'indicator_id']), indicator.get('id'))
          && connections.getIn(['recommendations', association.getIn(['attributes', 'recommendation_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'recommendation_id']))
      )
    )
);
