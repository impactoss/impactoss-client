import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectMeasureConnections,
  selectIndicatorConnections,
  selectTaxonomiesSorted,
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
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (id, taxonomies, categories, associations) =>
    prepareTaxonomiesIsAssociated(taxonomies, categories, associations, 'tags_sdgtargets', 'sdgtarget_id', id)
  );
export const selectIndicatorsAssociated = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'indicators'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (id, entities, associations) =>
    entitiesIsAssociated(entities, 'indicator_id', associations, 'sdgtarget_id', id)
);
// selectIndicators,
export const selectIndicators = createSelector(
  selectIndicatorsAssociated,
  (state) => selectIndicatorConnections(state),
  (state) => selectEntities(state, 'measure_indicators'),
  (state) => selectEntities(state, 'sdgtarget_indicators'),
  (indicators, connections, indicatorMeasures, indicatorTargets) =>
    indicators && indicatorTargets && indicators
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

export const selectMeasuresAssociated = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (id, entities, associations) =>
    entitiesIsAssociated(entities, 'measure_id', associations, 'sdgtarget_id', id)
);
// all connected measures
export const selectMeasures = createSelector(
  selectMeasuresAssociated,
  (state) => selectMeasureConnections(state),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (state) => selectEntities(state, 'measure_categories'),
  (state) => selectEntities(state, 'measure_indicators'),
  (measures, connections, measureTargets, measureRecommendations, measureCategories, measureIndicators) =>
    measures && measureTargets && measures
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
        .map((association) => association.getIn(['attributes', 'recommendation_id']))
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
