import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectMeasureConnections,
  selectIndicatorConnections,
} from 'containers/App/selectors';

import {
  entitySetUser,
  attributesEqual,
  entitiesIsAssociated,
  prepareTaxonomiesIsAssociated,
} from 'utils/entities';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'sdgtargets', id }),
  (state) => selectEntities(state, 'users'),
  (entity, users) => entitySetUser(entity, users)
);
export const selectTaxonomies = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (id, taxonomies, categories, associations) =>
    prepareTaxonomiesIsAssociated(taxonomies, categories, associations, 'tags_sdgtargets', 'sdgtarget_id', id)
  );

// selectIndicators,
export const selectIndicators = createSelector(
  (state, id) => id,
  (state) => selectIndicatorConnections(state),
  (state) => selectEntities(state, 'indicators'),
  (state) => selectEntities(state, 'measure_indicators'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (id, connections, indicators, indicatorMeasures, indicatorTargets) =>
    indicators && indicatorTargets && entitiesIsAssociated(indicators, 'indicator_id', indicatorTargets, 'sdgtarget_id', id)
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
// all connected measures
export const selectMeasures = createSelector(
  (state, id) => id,
  (state) => selectMeasureConnections(state),
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'measure_indicators'),
  (id, connections, measures, measureTargets, measureRecommendations, measureCategories, measureIndicators) =>
    measures && measureTargets && entitiesIsAssociated(measures, 'measure_id', measureTargets, 'sdgtarget_id', id)
    .map((measure) => measure
      .set('categories', measureCategories
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
        )
        .map((association) => association.getIn(['attributes', 'category_id']))
      )
      .set('sdgtargets', measureTargets
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
          && connections.getIn(['sdgtargets', association.getIn(['attributes', 'sdgtarget_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'sdgtarget_id']))
      )
      .set('recommendations', measureRecommendations
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
          && connections.getIn(['recommendations', association.getIn(['attributes', 'recommendation_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'sdgtarget_id']))
      )
      .set('indicators', measureIndicators
        .filter((association) =>
          attributesEqual(association.getIn(['attributes', 'measure_id']), measure.get('id'))
          && connections.getIn(['indicators', association.getIn(['attributes', 'indicator_id']).toString()])
        )
        .map((association) => association.getIn(['attributes', 'indicator_id']))
      )
    )
);
