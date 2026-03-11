import { createSelector } from 'reselect';

import {
  selectEntity,
  selectUsers,
  selectUserRoles,
  selectRoles,
  selectCategories,
  selectTaxonomiesSorted,
  selectUserCategoriesByUser,
} from 'containers/App/selectors';

import {
  entitySetUser,
  prepareTaxonomiesAssociated,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

export const selectDomain = (state) => state.get('userEdit');

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'users', id }),
  selectUsers,
  selectUserRoles,
  selectRoles,
  (entity, users, userRoles, roles) => entity
    && users
    && userRoles
    && roles
  && entitySetUser(entity, users).set(
    'userRoles',
    userRoles.filter((association) => qe(
      association.getIn(['attributes', 'user_id']),
      entity.get('id'),
    )),
  ).set(
    'roles',
    userRoles.filter(
      (association) => qe(
        association.getIn(['attributes', 'user_id']),
        entity.get('id'),
      ),
    ).map(
      (association) => roles.find(
        (role) => qe(
          role.get('id'),
          association.getIn(['attributes', 'role_id']),
        ),
      ),
    ),
  ),
);

export const selectTaxonomies = createSelector(
  (state, id) => id,
  selectTaxonomiesSorted,
  selectCategories,
  selectUserCategoriesByUser,
  (id, taxonomies, categories, associations) => prepareTaxonomiesAssociated(
    taxonomies,
    categories,
    associations,
    'tags_users',
    id,
  ),
);

export const selectEntityRoles = createSelector(
  (state, id) => id,
  selectRoles,
  selectUserRoles,
  (id, roles, userRoles) => roles && roles.map(
    (role) => {
      const filteredAssociations = userRoles.filter(
        (association) => qe(
          association.getIn(['attributes', 'user_id']),
          id,
        ),
      );
      const entityAssociation = filteredAssociations.find(
        (association) => qe(
          association.getIn(['attributes', 'role_id']),
          role.get('id'),
        ),
      );
      return role
        .set('associated', !!entityAssociation || false)
        .set('associationId', entityAssociation && entityAssociation.get('id'));
    },
  ),
);
