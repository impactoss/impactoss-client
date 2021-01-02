import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectRecommendationsCategorised,
  selectFWTaxonomiesSorted,
  selectFWIndicators,
  selectFrameworks,
} from 'containers/App/selectors';

import {
  entitiesSetAssociated,
  entitySetUser,
  prepareTaxonomiesAssociated,
  prepareTaxonomiesMultiple,
  attributesEqual,
} from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('measureEdit'),
  (substate) => substate.toJS()
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'measures', id }),
  (state) => selectEntities(state, 'users'),
  (entity, users) => entitySetUser(entity, users)
);
export const selectTaxonomies = createSelector(
  (state, id) => id,
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'measure_categories'),
  (id, taxonomies, categories, associations) =>
    prepareTaxonomiesAssociated(taxonomies, categories, associations, 'tags_measures', 'measure_id', id, false)
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) =>
    prepareTaxonomiesMultiple(taxonomies, categories, ['tags_recommendations'], false)
);

export const selectRecommendationsByFw = createSelector(
  (state, id) => id,
  (state) => selectRecommendationsCategorised(state),
  (state) => selectEntities(state, 'recommendation_indicators'),
  (state) => selectFrameworks(state),
  (id, entities, associations, frameworks) =>
    entitiesSetAssociated(entities, 'recommendation_id', associations, 'indicator_id', id)
    .filter((r) => {
      const framework = frameworks.find(
        (fw) =>
          attributesEqual(
            fw.get('id'),
            r.getIn(['attributes', 'framework_id']),
          )
        );
      return framework.getIn(['attributes', 'has_measures']);
    })
    .groupBy(
      (r) => r.getIn(['attributes', 'framework_id']).toString()
    )
);
export const selectIndicators = createSelector(
  (state, id) => id,
  selectFWIndicators,
  (state) => selectEntities(state, 'measure_indicators'),
  (id, entities, associations) =>
    entitiesSetAssociated(entities, 'indicator_id', associations, 'measure_id', id)
);
