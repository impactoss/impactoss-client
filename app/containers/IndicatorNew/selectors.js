import { createSelector } from 'reselect';

import { selectEntities } from 'containers/App/selectors';
import { USER_ROLES } from 'themes/config';

import { usersByRole, prepareTaxonomiesMultiple } from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('indicatorNew'),
  (substate) => substate.toJS()
);
// all users of role contributor
export const selectUsers = createSelector(
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (entities, associations) =>
    usersByRole(entities, associations, USER_ROLES.CONTRIBUTOR.value)
);

export const selectConnectedTaxonomies = createSelector(
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (taxonomies, categories) =>
    prepareTaxonomiesMultiple(taxonomies, categories, ['tags_measures', 'tags_sdgtargets'])
);
