import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectTaxonomiesSorted,
} from 'containers/App/selectors';

import {
  entitySetUser,
  prepareTaxonomiesIsAssociated,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'users', id }),
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (state) => selectEntities(state, 'roles'),
  (entity, users, userRoles, roles) => entity && users && userRoles && roles && entitySetUser(entity, users).set(
    'roles',
    userRoles
      .filter((association) => qe(association.getIn(['attributes', 'user_id']), entity.get('id')))
      .map((association) => roles.find((role) => qe(role.get('id'), association.getIn(['attributes', 'role_id']))))
  )
);

export const selectTaxonomies = createSelector(
  (state, id) => id,
  (state) => selectTaxonomiesSorted(state),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'user_categories'),
  (id, taxonomies, categories, associations) => prepareTaxonomiesIsAssociated(taxonomies, categories, associations, 'tags_users', 'user_id', id)
);
