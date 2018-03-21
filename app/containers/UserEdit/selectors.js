import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectTaxonomiesSorted,
} from 'containers/App/selectors';

import {
  entitiesSetAssociated,
  entitySetUser,
  prepareTaxonomiesAssociated,
  attributesEqual,
} from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('userEdit'),
  (substate) => substate.toJS()
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'users', id }),
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (state) => selectEntities(state, 'roles'),
  (entity, users, userRoles, roles) =>
    entity && users && userRoles && roles && entitySetUser(entity, users).set(
      'roles',
      userRoles
      .filter((association) => attributesEqual(association.getIn(['attributes', 'user_id']), entity.get('id')))
      .map((association) => roles.find((role) => attributesEqual(role.get('id'), association.getIn(['attributes', 'role_id'])))
      )
    )
);

export const selectTaxonomies = createSelector(
  (state, id) => id,
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'user_categories'),
  (id, taxonomies, categories, associations) =>
    prepareTaxonomiesAssociated(taxonomies, categories, associations, 'tags_users', 'user_id', id)
);

export const selectRoles = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'roles'),
  (state) => selectEntities(state, 'user_roles'),
  (id, roles, userRoles) =>
    entitiesSetAssociated(roles, 'role_id', userRoles, 'user_id', id)
);
