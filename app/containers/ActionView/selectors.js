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


// all connected recommendations
export const selectRecommendations = createSelector(
  (state, id) => id,
  (state) => selectRecommendationConnections(state),
  (state) => selectEntities(state, 'recommendations'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (id, connections, recommendations, recMeasures, recCategories) =>
    recommendations && recMeasures && entitiesIsAssociated(recommendations, 'recommendation_id', recMeasures, 'measure_id', id)
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

// all connected sdgTargets
export const selectSdgTargets = createSelector(
  (state, id) => id,
  (state) => selectSdgTargetConnections(state),
  (state) => selectEntities(state, 'sdgtargets'),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (id, connections, targets, targetMeasures, targetCategories, targetIndicators) =>
    targets && targetMeasures && entitiesIsAssociated(targets, 'sdgtarget_id', targetMeasures, 'measure_id', id)
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

//
// selectIndicators,
export const selectIndicators = createSelector(
  (state, id) => id,
  (state) => selectIndicatorConnections(state),
  (state) => selectEntities(state, 'indicators'),
  (state) => selectEntities(state, 'measure_indicators'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (id, connections, indicators, indicatorMeasures, indicatorTargets) =>
    indicators && indicatorMeasures && entitiesIsAssociated(indicators, 'indicator_id', indicatorMeasures, 'measure_id', id)
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
