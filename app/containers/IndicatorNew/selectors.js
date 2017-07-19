import { createSelector } from 'reselect';

import { selectEntities } from 'containers/App/selectors';
import { USER_ROLES } from 'containers/App/constants';

import { usersSetRoles } from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('indicatorNew'),
  (substate) => substate.toJS()
);
// all users of role contributor
export const selectUsers = createSelector(
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (entities, associations) =>
    usersSetRoles(entities, associations, USER_ROLES.CONTRIBUTOR)
);
