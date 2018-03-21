import { createSelector } from 'reselect';
import { selectEntities, selectTaxonomiesSorted } from 'containers/App/selectors';

import { USER_ROLES, ENABLE_SDGS } from 'themes/config';

import {
  usersByRole,
  prepareTaxonomiesMultiple,
} from 'utils/entities';


export const selectDomain = createSelector(
  (state) => state.get('categoryNew'),
  (substate) => substate.toJS()
);

// all users of role manager
export const selectUsers = createSelector(
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (entities, associations) =>
    usersByRole(entities, associations, USER_ROLES.MANAGER.value)
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) => ENABLE_SDGS
    ? prepareTaxonomiesMultiple(taxonomies, categories, ['tags_measures', 'tags_sdgtargets', 'tags_recommendations'])
    : prepareTaxonomiesMultiple(taxonomies, categories, ['tags_measures', 'tags_recommendations'])
);
