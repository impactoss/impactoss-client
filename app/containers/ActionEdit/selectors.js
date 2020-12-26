import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectRecommendationsCategorised,
  selectTaxonomiesSorted,
  selectFWIndicators,
} from 'containers/App/selectors';

import {
  entitiesSetAssociated,
  entitySetUser,
  prepareTaxonomiesAssociated,
  prepareTaxonomiesMultiple,
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
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'measure_categories'),
  (id, taxonomies, categories, associations) =>
    prepareTaxonomiesAssociated(taxonomies, categories, associations, 'tags_measures', 'measure_id', id, false)
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) =>
    prepareTaxonomiesMultiple(taxonomies, categories, ['tags_recommendations'], false)
);


export const selectRecommendations = createSelector(
  (state, id) => id,
  selectRecommendationsCategorised,
  (state) => selectEntities(state, 'recommendation_measures'),
  (id, entities, associations) =>
    entitiesSetAssociated(entities, 'recommendation_id', associations, 'measure_id', id)
);
export const selectIndicators = createSelector(
  (state, id) => id,
  selectFWIndicators,
  (state) => selectEntities(state, 'measure_indicators'),
  (id, entities, associations) =>
    entitiesSetAssociated(entities, 'indicator_id', associations, 'measure_id', id)
);
