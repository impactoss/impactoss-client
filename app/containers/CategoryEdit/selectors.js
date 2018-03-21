import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectMeasuresCategorised,
  selectSdgTargetsCategorised,
  selectRecommendationsCategorised,
  selectTaxonomiesSorted,
} from 'containers/App/selectors';

import { USER_ROLES, ENABLE_SDGS } from 'themes/config';

import {
  prepareCategory,
  usersByRole,
  entitiesSetAssociated,
  prepareTaxonomiesMultiple,
} from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('categoryEdit'),
  (substate) => substate.toJS()
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'categories', id }),
  (state) => selectEntities(state, 'users'),
  (state) => selectTaxonomiesSorted(state),
  (entity, users, taxonomies) => prepareCategory(entity, users, taxonomies)
);

export const selectUsers = createSelector(
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (entities, associations) =>
    usersByRole(entities, associations, USER_ROLES.MANAGER.value)
);

export const selectMeasures = createSelector(
  (state, id) => id,
  (state) => selectMeasuresCategorised(state),
  (state) => selectEntities(state, 'measure_categories'),
  (id, entities, associations) =>
    entitiesSetAssociated(entities, 'measure_id', associations, 'category_id', id)
);

export const selectSdgTargets = createSelector(
  (state, id) => id,
  (state) => selectSdgTargetsCategorised(state),
  (state) => selectEntities(state, 'sdgtarget_categories'),
  (id, entities, associations) =>
    entitiesSetAssociated(entities, 'sdgtarget_id', associations, 'category_id', id)
);

export const selectRecommendations = createSelector(
  (state, id) => id,
  (state) => selectRecommendationsCategorised(state),
  (state) => selectEntities(state, 'recommendation_categories'),
  (id, entities, associations) =>
    entitiesSetAssociated(entities, 'recommendation_id', associations, 'category_id', id)
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => ENABLE_SDGS
    ? prepareTaxonomiesMultiple(taxonomies, categories, ['tags_measures', 'tags_sdgtargets', 'tags_recommendations'])
    : prepareTaxonomiesMultiple(taxonomies, categories, ['tags_measures', 'tags_recommendations'])
);
