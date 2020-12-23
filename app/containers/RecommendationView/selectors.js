import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectMeasureConnections,
  selectTaxonomiesSorted,
  selectIndicatorConnections,
} from 'containers/App/selectors';

import {
  entitySetUser,
  prepareTaxonomiesIsAssociated,
  entitiesIsAssociated,
  attributesEqual,
  getEntityCategories,
} from 'utils/entities';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'recommendations', id }),
  (state) => selectEntities(state, 'users'),
  (entity, users) => entitySetUser(entity, users)
);

export const selectTaxonomies = createSelector(
  (state, id) => id,
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (id, taxonomies, categories, associations) =>
    prepareTaxonomiesIsAssociated(taxonomies, categories, associations, 'tags_recommendations', 'recommendation_id', id)
);

export const selectMeasuresAssociated = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (id, entities, associations) =>
    entitiesIsAssociated(entities, 'measure_id', associations, 'recommendation_id', id)
);
// all connected measures
export const selectMeasures = createSelector(
  selectMeasuresAssociated,
  (state) => selectMeasureConnections(state),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'measure_indicators'),
  (state) => selectEntities(state, 'categories'),
  (measures, connections, measureRecommendations, measureCategories, measureIndicators, categories) =>
    measures && measures
    .map((measure) => measure
      .set('categories', getEntityCategories(measure.get('id'), measureCategories, 'measure_id', categories))
      .set('recommendations', measureRecommendations && measureRecommendations
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
          && connections.getIn(['recommendations', association.getIn(['attributes', 'recommendation_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'recommendation_id']))
      )
      .set('indicators', measureIndicators && measureIndicators
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
          && connections.getIn(['indicators', association.getIn(['attributes', 'indicator_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'indicator_id']))
      )
    )
);

export const selectIndicatorsAssociated = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'indicators'),
  (state) => selectEntities(state, 'recommendation_indicators'),
  (id, entities, associations) =>
    entitiesIsAssociated(entities, 'indicator_id', associations, 'recommendation_id', id)
);

// selectIndicators,
export const selectIndicators = createSelector(
  selectIndicatorsAssociated,
  (state) => selectIndicatorConnections(state),
  (state) => selectEntities(state, 'measure_indicators'),
  (state) => selectEntities(state, 'recommendation_indicators'),
  (indicators, connections, indicatorMeasures, indicatorRecs) =>
    indicators && indicatorRecs && indicators
    .map((indicator) => indicator
      .set('measures', indicatorMeasures
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
