import { createSelector } from 'reselect';

import {
  selectEntity,
  selectEntities,
} from 'containers/App/selectors';

import {
  entitiesSetAssociated,
  entitySetUser,
  prepareTaxonomies,
} from 'utils/entities';

export const selectDomain = createSelector(
  (state) => state.get('userEdit'),
  (substate) => substate.toJS()
);

export const selectViewEntity = createSelector(
  (state, id) => selectEntity(state, { path: 'users', id }),
  (state) => selectEntities(state, 'users'),
  (state) => selectEntities(state, 'user_roles'),
  (entity, users) => entitySetUser(entity, users)
);
//
// viewEntity: getUser(
//   state,
//
//       {
//         path: 'user_roles',
//         key: 'user_id',
//         as: 'roles',
//         reverse: true,
//         extend: {
//           type: 'single',
//           path: 'roles',
//           key: 'role_id',
//           as: 'role',
//         },
//       },
//     ],
//   },
// ),
export const selectTaxonomies = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'taxonomies'),
  (state) => selectEntities(state, 'categories'),
  (state) => selectEntities(state, 'user_categories'),
  (id, taxonomies, categories, associations) =>
    prepareTaxonomies(taxonomies, categories, associations, 'tags_users', 'user_id', id)
);

export const selectRoles = createSelector(
  (state, id) => id,
  (state) => selectEntities(state, 'roles'),
  (state) => selectEntities(state, 'user_roles'),
  (id, entities, associations) =>
    entitiesSetAssociated(entities, 'role_id', associations, 'user_id', id)
);
