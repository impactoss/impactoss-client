import { createSelector } from 'reselect';

import { selectEntities } from 'containers/App/selectors';
import { USER_ROLES } from 'containers/App/constants';

import { usersSetRoles } from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('categoryNew'),
  (substate) => substate.toJS()
);

// all users of role manager
export const selectUsers = createSelector(
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (entities, associations) =>
    usersSetRoles(entities, associations, USER_ROLES.MANAGER)
);
