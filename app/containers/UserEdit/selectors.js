import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
  selectTaxonomiesSorted,
  selectUserCategoriesByUser,
} from 'containers/App/selectors';

import {
  entitySetUser,
  prepareTaxonomiesAssociated,
} from 'utils/entities';
import { qe } from 'utils/quasi-equals';

export const selectDomain = createSelector(
  (state) => state.get('userEdit'),
  (substate) => substate
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'users', id }),
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (state) => selectEntities(state, 'roles'),
  (entity, users, userRoles, roles) => entity && users && userRoles && roles && entitySetUser(entity, users).set(
    'roles',
    userRoles.filter(
      (association) => qe(
        association.getIn(['attributes', 'user_id']),
        entity.get('id'),
      )
    ).map(
      (association) => roles.find(
        (role) => qe(
          role.get('id'),
          association.getIn(['attributes', 'role_id']),
        )
      )
    )
  )
);

export const selectTaxonomies = createSelector(
  (state, id) => id,
  selectTaxonomiesSorted,
  (state) => selectEntities(state, 'categories'),
  selectUserCategoriesByUser,
  (id, taxonomies, categories, associations) => prepareTaxonomiesAssociated(
    taxonomies,
    categories,
    associations,
    'tags_users',
    id,
  )
);

export const selectRoles = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'roles'),
  (state) => selectEntities(state, 'user_roles'),
  (id, roles, userRoles) => roles && roles.map(
    (role) => {
      const filteredAssociations = userRoles.filter(
        (association) => qe(
          association.getIn(['attributes', 'user_id']),
          id,
        )
      );
      const entityAssociation = filteredAssociations.find(
        (association) => qe(
          association.getIn(['attributes', 'role_id']),
          role.get('id'),
        )
      );
      return role.set('associated', !!entityAssociation || false);
    }
  )
);
