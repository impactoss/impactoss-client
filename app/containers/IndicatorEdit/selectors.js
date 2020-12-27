import { createSelector } from 'reselect';

import { USER_ROLES } from 'themes/config';

import {
  selectEntity,
  selectEntities,
  selectMeasuresCategorised,
  selectRecommendationsCategorised,
  selectFWTaxonomiesSorted,
} from 'containers/App/selectors';

import {
  entitiesSetAssociated,
  entitySetUser,
  usersByRole,
  prepareTaxonomiesMultiple,
} from 'utils/entities';


/**
 * Direct selector to the indicatorEdit state domain
 */
export const selectDomain = createSelector(
  (state) => state.get('indicatorEdit'),
  (substate) => substate.toJS()
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'indicators', id }),
  (state) => selectEntities(state, 'users'),
  (entity, users) => entitySetUser(entity, users)
);

export const selectMeasures = createSelector(
  (state, id) => id,
  (state) => selectMeasuresCategorised(state),
  (state) => selectEntities(state, 'measure_indicators'),
  (id, entities, associations) =>
    entitiesSetAssociated(entities, 'measure_id', associations, 'indicator_id', id)
);


export const selectConnectedTaxonomies = createSelector(
  (state) => selectFWTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) =>
    prepareTaxonomiesMultiple(taxonomies, categories, ['tags_measures'])
);

export const selectRecommendations = createSelector(
  (state, id) => id,
  (state) => selectRecommendationsCategorised(state),
  (state) => selectEntities(state, 'recommendation_indicators'),
  (id, entities, associations) =>
    entitiesSetAssociated(entities, 'recommendation_id', associations, 'indicator_id', id)
);

export const selectUsers = createSelector(
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (entities, associations) =>
    usersByRole(entities, associations, USER_ROLES.CONTRIBUTOR.value)
);
