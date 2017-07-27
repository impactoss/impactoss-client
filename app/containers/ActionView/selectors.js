import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectRecommendationConnections,
  selectSdgTargetConnections,
  selectIndicatorConnections,
} from 'containers/App/selectors';

import {
  entitySetUser,
  attributesEqual,
  entitiesIsAssociated,
  prepareTaxonomiesIsAssociated,
} from 'utils/entities';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'measures', id }),
  (state) => selectEntities(state, 'users'),
  (entity, users) => entitySetUser(entity, users)
);

export const selectTaxonomies = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'measure_categories'),
  (id, taxonomies, categories, associations) =>
    prepareTaxonomiesIsAssociated(taxonomies, categories, associations, 'tags_measures', 'measure_id', id)
  );

export const selectRecommendationsAssociated = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'recommendations'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (id, entities, associations) =>
    entitiesIsAssociated(entities, 'recommendation_id', associations, 'measure_id', id)
);
// all connected recommendations
export const selectRecommendations = createSelector(
  selectRecommendationsAssociated,
  (state) => selectRecommendationConnections(state),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (recommendations, connections, recMeasures, recCategories) =>
    recommendations && recMeasures && recommendations
    .map((rec) => rec
      .set('categories', recCategories
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'recommendation_id']), rec.get('id'))
        )
        .map((association) => association.getIn(['attributes', 'category_id']))
      )
      .set('measures', recMeasures
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'recommendation_id']), rec.get('id'))
          && connections.getIn(['measures', association.getIn(['attributes', 'measure_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'measure_id']))
      )
    )
);
export const selectTargetsAssociated = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'sdgtargets'),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (id, entities, associations) =>
    entitiesIsAssociated(entities, 'sdgtarget_id', associations, 'measure_id', id)
);
// all connected sdgTargets
export const selectSdgTargets = createSelector(
  selectTargetsAssociated,
  (state) => selectSdgTargetConnections(state),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (targets, connections, targetMeasures, targetCategories, targetIndicators) =>
    targets && targetMeasures && targets
    .map((target) => target
      .set('categories', targetCategories
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), target.get('id'))
        )
        .map((association) => association.getIn(['attributes', 'category_id']))
      )
      .set('measures', targetMeasures
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), target.get('id'))
          && connections.getIn(['measures', association.getIn(['attributes', 'measure_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'measure_id']))
      )
      .set('indicators', targetIndicators
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), target.get('id'))
          && connections.getIn(['indicators', association.getIn(['attributes', 'indicator_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'indicator_id']))
      )
    )
);

export const selectIndicatorsAssociated = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'indicators'),
  (state) => selectEntities(state, 'measure_indicators'),
  (id, entities, associations) =>
    entitiesIsAssociated(entities, 'indicator_id', associations, 'measure_id', id)
);
// selectIndicators,
export const selectIndicators = createSelector(
  selectIndicatorsAssociated,
  (state) => selectIndicatorConnections(state),
  (state) => selectEntities(state, 'measure_indicators'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (indicators, connections, indicatorMeasures, indicatorTargets) =>
    indicators && indicatorMeasures && indicators
    .map((indicator) => indicator
      .set('measures', indicatorMeasures
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'indicator_id']), indicator.get('id'))
          && connections.getIn(['measures', association.getIn(['attributes', 'measure_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'measure_id']))
      )
      .set('sdgtargets', indicatorTargets
        .filter((association) =>
        attributesEqual(association.getIn(['attributes', 'indicator_id']), indicator.get('id'))
          && connections.getIn(['sdgtargets', association.getIn(['attributes', 'sdgtarget_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'sdgtarget_id']))
      )
    )
);
