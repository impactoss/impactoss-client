import { createSelector } from 'reselect';
import { ENABLE_SDGS } from 'themes/config';
import {
  selectEntity,
  selectEntities,
  selectRecommendationConnections,
  selectSdgTargetConnections,
  selectIndicatorConnections,
  selectTaxonomiesSorted,
} from 'containers/App/selectors';

import {
  entitySetUser,
  attributesEqual,
  entitiesIsAssociated,
  prepareTaxonomiesAssociated,
  getAllCategories,
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
  (state) => selectEntities(state, 'recommendations'),
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
  (state) => selectEntities(state, 'categories'),
  (recommendations, connections, recMeasures, recCategories, categories) =>
    recommendations && recommendations
    .map((rec) => rec
      .set('categories', getAllCategories(rec.get('id'), recCategories, 'recommendation_id', categories))
      .set('measures', recMeasures && recMeasures
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
  (state) => selectEntities(state, 'categories'),
  (targets, connections, targetMeasures, targetCategories, targetIndicators, categories) =>
    targets && targets
    .map((target) => target
      .set('categories', getAllCategories(target.get('id'), targetCategories, 'sdgtarget_id', categories))
      .set('measures', targetMeasures && targetMeasures
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'sdgtarget_id']), target.get('id'))
          && connections.getIn(['measures', association.getIn(['attributes', 'measure_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'measure_id']))
      )
      .set('indicators', targetIndicators && targetIndicators
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
    indicators && indicators
    .map((indicator) => indicator
      .set('measures', indicatorMeasures && indicatorMeasures
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'indicator_id']), indicator.get('id'))
          && connections.getIn(['measures', association.getIn(['attributes', 'measure_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'measure_id']))
      )
      .set('sdgtargets', ENABLE_SDGS && indicatorTargets && indicatorTargets
        .filter((association) =>
        attributesEqual(association.getIn(['attributes', 'indicator_id']), indicator.get('id'))
          && connections.getIn(['sdgtargets', association.getIn(['attributes', 'sdgtarget_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'sdgtarget_id']))
      )
    )
);
