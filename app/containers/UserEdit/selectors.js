import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
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
    entity && entitySetUser(
      entity.set(
        'roles',
        userRoles
        .filter((userRole) => attributesEqual(userRole.getIn(['attributes', 'user_id']), entity.get('id')))
        .map((userRole) => roles.find((role) => attributesEqual(role.get('id'), userRole.getIn(['attributes', 'role_id']))))
      ),
      users
    )
);

export const selectTaxonomies = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'user_categories'),
  (id, taxonomies, categories, associations) =>
    prepareTaxonomiesAssociated(taxonomies, categories, associations, 'tags_users', 'user_id', id)
);

export const selectRoles = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'roles'),
  (state) => selectEntities(state, 'user_roles'),
  (id, entities, associations) =>
    entitiesSetAssociated(entities, 'role_id', associations, 'user_id', id)
);
