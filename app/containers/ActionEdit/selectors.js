import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectRecommendationsCategorised,
  selectSdgTargetsCategorised,
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
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'measure_categories'),
  (id, taxonomies, categories, associations) =>
    prepareTaxonomiesAssociated(taxonomies, categories, associations, 'tags_measures', 'measure_id', id)
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) =>
    prepareTaxonomiesMultiple(taxonomies, categories, ['tags_recommendations', 'tags_sdgtargets'])
);


export const selectRecommendations = createSelector(
  (state, id) => id,
  (state) => selectRecommendationsCategorised(state),
  (state) => selectEntities(state, 'recommendation_measures'),
  (id, entities, associations) =>
    entitiesSetAssociated(entities, 'recommendation_id', associations, 'measure_id', id)
);
export const selectSdgTargets = createSelector(
  (state, id) => id,
  (state) => selectSdgTargetsCategorised(state),
  (state) => selectEntities(state, 'sdgtarget_measures'),
  (id, entities, associations) =>
    entitiesSetAssociated(entities, 'sdgtarget_id', associations, 'measure_id', id)
);
export const selectIndicators = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'indicators'),
  (state) => selectEntities(state, 'measure_indicators'),
  (id, entities, associations) =>
    entitiesSetAssociated(entities, 'indicator_id', associations, 'measure_id', id)
);
