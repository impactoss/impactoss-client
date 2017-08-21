import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
} from 'containers/App/selectors';

import { USER_ROLES } from 'containers/App/constants';

import {
  prepareCategory,
  usersSetRoles,
} from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('categoryEdit'),
  (substate) => substate.toJS()
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'categories', id }),
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'taxonomies'),
  (entity, users, taxonomies) => prepareCategory(entity, users, taxonomies)
);

export const selectUsers = createSelector(
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (entities, associations) =>
    usersSetRoles(entities, associations, USER_ROLES.MANAGER)
);
