import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
} from 'containers/App/selectors';

import {
  entitiesSetAssociated,
  entitySetUser,
  prepareTaxonomiesAssociated,
} from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('recommendationEdit'),
  (substate) => substate.toJS()
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'recommendations', id }),
  (state) => selectEntities(state, 'users'),
  (entity, users) => entitySetUser(entity, users)
);

export const selectTaxonomies = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'recommendation_categories'),
  (id, taxonomies, categories, associations) =>
    prepareTaxonomiesAssociated(taxonomies, categories, associations, 'tags_recommendations', 'recommendation_id', id)
);
export const selectMeasures = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'measures'),
  (state) => selectEntities(state, 'recommendation_measures'),
  (id, entities, associations) =>
    entitiesSetAssociated(entities, 'measure_id', associations, 'recommendation_id', id)
);
